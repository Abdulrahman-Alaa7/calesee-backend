import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateReviewDto, UpdateReviewStatusDto } from './dto/review.dto';
import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import sharp from 'sharp';
import { ReviewsGateway } from './reviews.gateway';

@Injectable()
export class ReviewsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reviewGateway: ReviewsGateway,
  ) {}

  async createReview(dto: CreateReviewDto) {
    const { image, ...rest } = dto;

    let imageUrl: string | null = null;
    let imageName: string | null = null;

    if (image) {
      const uploaded = await this.storeImage(image);
      imageUrl = uploaded.url;
      imageName = uploaded.name;
    }

    const review = await this.prisma.review.create({
      data: {
        ...rest,
        imageUrl,
        imageName,
      },
    });

    await this.prisma.notification.create({
      data: {
        message: 'New review needs approval',
        theId: review.productId,
      },
    });

    this.reviewGateway.sendReviewNotification({
      message: 'New review',
      theId: review.productId,
    });

    return review;
  }

  async updateStatus(dto: UpdateReviewStatusDto) {
    return this.prisma.review.update({
      where: { id: dto.id },
      data: { status: dto.status as any },
    });
  }

  async deleteReview(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
    });

    if (!review) throw new BadRequestException('Review not found');

    if (review.imageName) {
      const fullPath = join(
        process.cwd(),
        'public',
        'reviews',
        review.imageName,
      );

      fs.unlink(fullPath, () => {});
    }

    await this.prisma.review.delete({
      where: { id },
    });

    return {
      message: 'Review deleted',
      success: true,
    };
  }

  async getReviewsAdmin(productId: string) {
    return this.prisma.review.findMany({
      where: {
        productId,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProductReviews(productId: string) {
    return this.prisma.review.findMany({
      where: {
        productId,
        status: 'Approved',
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  private async storeImage(file: any) {
    const { createReadStream, filename } = await file;

    const uniqueName = `${uuidv4()}_${filename}`;
    const folder = 'reviews';

    const filePath = join(process.cwd(), 'public', folder, uniqueName);

    const buffer = await this.streamToBuffer(createReadStream());

    await sharp(buffer).resize(800).jpeg({ quality: 70 }).toFile(filePath);

    return {
      url: `${process.env.APP_URL}/${folder}/${uniqueName}`,
      name: uniqueName,
    };
  }

  private async streamToBuffer(stream: any): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: any[] = [];
      stream.on('data', (chunk) => chunks.push(chunk));
      stream.on('end', () => resolve(Buffer.concat(chunks)));
      stream.on('error', reject);
    });
  }
}
