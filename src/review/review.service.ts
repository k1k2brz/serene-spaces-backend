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
      throw new ReviewCustomerOnlyException();
    }

    const product = await this.productRepository.findOneBy({
      id: customerReviewDto.productId,
    });

    if (!product) {
      throw new ProductNotFoundException();
    }

    const review = this.reviewRepository.create({
      reviewText: customerReviewDto.reviewText,
      rating: customerReviewDto.rating,
      product,
      customer: user,
    });

    return this.reviewRepository.save(review);
  }

  async updateReview(
    reviewId: number,
    customerReviewDto: CustomerReviewDto,
    user: User,
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['customer'], // TypeORM이 엔티티 간의 관계를 로드할 때 사용하는 것
    });

    if (!review) {
      throw new ReviewNotFoundException();
    }

    if (review.customer.id !== user.id && user.role !== userRole.ADMIN) {
      throw new ReviewUpdateAuthException();
    }

    review.reviewText = customerReviewDto.reviewText;
    review.rating = customerReviewDto.rating;

    return this.reviewRepository.save(review);
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
  }
}
