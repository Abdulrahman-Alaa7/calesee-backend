import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { CategoryDto, UpdateCategoryDto } from './dto/category.dto';
import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async createCategory(categoryDto: CategoryDto) {
    const { nameEn, nameAr, image } = categoryDto;

    if (!nameEn || !nameAr) {
      throw new BadRequestException('nameEn and nameAr are required');
    }

    if (!image) {
      throw new BadRequestException('Image is required');
    }

    const imageUrl = await this.storeImageAndGetURL(image);

    const category = await this.prisma.category.create({
      data: {
        nameEn,
        nameAr,
        imageUrl: imageUrl,
      },
    });

    return { category };
  }

  async updateCategory(updateCategoryDto: UpdateCategoryDto) {
    const { id, nameEn, nameAr, image } = updateCategoryDto;

    const categoryItem = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!categoryItem) {
      throw new BadRequestException('Category not found');
    }

    let imageUrl: string | null = categoryItem.imageUrl;

    if (image) {
      if (categoryItem.imageUrl) {
        const imagePath = categoryItem.imageUrl.replace(
          `${process.env.APP_URL}/`,
          '',
        );
        const fullImagePath = join(process.cwd(), 'public', imagePath);

        fs.unlink(fullImagePath, (err: any) => {
          if (err) {
            // ممكن تسجل اللوج هنا
          }
        });
      }

      imageUrl = await this.storeImageAndGetURL(image);
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        nameEn: nameEn ?? categoryItem.nameEn,
        nameAr: nameAr ?? categoryItem.nameAr,
        imageUrl: imageUrl,
      },
    });

    return { category };
  }

  async deleteCategory(id: string) {
    const categoryItem = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!categoryItem) {
      throw new BadRequestException('Category not found');
    }

    const productsCount = await this.prisma.product.count({
      where: { categoryId: id },
    });

    if (productsCount > 0) {
      throw new BadRequestException(
        'Cannot delete category because it has related products',
      );
    }

    if (categoryItem.imageUrl) {
      const imagePath = categoryItem.imageUrl.replace(
        `${process.env.APP_URL}/`,
        '',
      );
      const fullImagePath = join(process.cwd(), 'public', imagePath);

      fs.unlink(fullImagePath, (err: any) => {
        if (err) {
          // ممكن تسجل اللوج هنا
        }
      });
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: 'Category deleted successfully',
      success: true,
    };
  }

  async getCategories() {
    const categories = await this.prisma.category.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return categories;
  }

  private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
    const { createReadStream, filename } = await file;

    const uniqueFilename = `${uuidv4()}_${filename}`;
    const folder = 'imgs-categories';

    const imagePath = join(process.cwd(), 'public', folder, uniqueFilename);

    const imageUrl = `${process.env.APP_URL}/${folder}/${uniqueFilename}`;

    const readStream = createReadStream();
    const writeStream = fs.createWriteStream(imagePath);
    readStream.pipe(writeStream);

    return imageUrl;
  }
}
