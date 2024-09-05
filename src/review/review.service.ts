import { userRole } from '@/_configs';
import { Product } from '@/product/product.entity';
import { User } from '@/user/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CustomerReviewDto } from './dto/customer-review.dto';
import { Review } from './review.entity';
import { ProductNotFoundException } from '@/_exceptions/product/product-not-found.exception';
import { ReviewCustomerOnlyException } from '@/_exceptions/user/review/review-customer-only.exception';
import { ReviewNotFoundException } from '@/_exceptions/user/review/review-not-found.exception';
import { ReviewUpdateAuthException } from '@/_exceptions/user/review/review-update-auth.exception';
import { ReviewDeleteAuthException } from '@/_exceptions/user/review/review-delete-auth.exception';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async createReview(
    customerReviewDto: CustomerReviewDto,
    user: User,
  ): Promise<Review> {
    if (user.role !== userRole.CUSTOMER) {
      // 고객 한정
      throw new ReviewCustomerOnlyException();
    }

    const product = await this.productRepository.findOne({
      where: { id: customerReviewDto.productId },
      relations: ['reviews'],
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    const review = this.reviewRepository.create({
      comment: customerReviewDto.comment,
      rating: customerReviewDto.rating,
      product,
      customer: user,
    });

    await this.reviewRepository.save(review);

    // 리뷰가 추가된 후 평균 레이팅 업데이트
    await this.updateProductAverageRating(product.id);

    return review;
  }

  async updateReview(
    reviewId: number,
    customerReviewDto: CustomerReviewDto,
    user: User,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['customer', 'product'],
    });

    if (!review) {
      throw new ReviewNotFoundException();
    }

    if (review.customer.id !== user.id && user.role !== userRole.ADMIN) {
      throw new ReviewUpdateAuthException();
    }

    review.comment = customerReviewDto.comment;
    review.rating = customerReviewDto.rating;

    await this.reviewRepository.save(review);

    await this.updateProductAverageRating(review.product.id);

    return review;
  }

  async deleteReview(reviewId: number, user: User): Promise<void> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['customer'],
    });

    if (!review) {
      throw new ReviewNotFoundException();
    }

    // 고객 본인 또는 관리자만 삭제 가능
    if (review.customer.id !== user.id && user.role !== userRole.ADMIN) {
      throw new ReviewDeleteAuthException();
    }

    await this.reviewRepository.delete(reviewId);

    await this.updateProductAverageRating(review.product.id);
  }

  // 평균 레이팅 업데이트
  async updateProductAverageRating(productId: number): Promise<void> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
      relations: ['reviews'],
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    const totalRatings = product.reviews.reduce(
      (sum, review) => sum + review.rating,
      0,
    );
    const averageRating =
      product.reviews.length > 0 ? totalRatings / product.reviews.length : 0;

    product.averageRating = averageRating;

    await this.productRepository.save(product);
  }
}
