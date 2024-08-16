import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Put,
  Param,
  Delete,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CustomerReviewDto } from './dto/customer-review.dto';
import { JwtAuthGuard } from '@/user/auth/jwt.auth.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  // 리뷰등록
  @UseGuards(JwtAuthGuard)
  @Post()
  async createReview(@Body() customerReviewDto: CustomerReviewDto, @Req() req) {
    return this.reviewService.createReview(customerReviewDto, req.user);
  }

  // 리뷰 수정
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateReview(
    @Param('id') reviewId: number,
    @Body() customerReviewDto: CustomerReviewDto,
    @Req() req,
  ) {
    return this.reviewService.updateReview(
      reviewId,
      customerReviewDto,
      req.user,
    );
  }

  // 리뷰 삭제
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteReview(@Param('id') reviewId: number, @Req() req) {
    return this.reviewService.deleteReview(reviewId, req.user);
  }
  // (삭제의 경우 vendor는 불가 admin은 가능)
}
