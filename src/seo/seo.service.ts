// src/seo/seo.service.ts
import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SeoDto, UpdateSeoDto } from './dto/seo.dto';

@Injectable()
export class SeoService {
  constructor(private readonly prisma: PrismaService) {}

  async createSeo(seoDto: SeoDto) {
    const {
      page,
      titleEn,
      titleAr,
      descEn,
      descAr,
      keywordsEn = [],
      keywordsAr = [],
    } = seoDto;

    if (!page || !titleEn || !titleAr || !descEn || !descAr) {
      throw new BadRequestException(
        'page, titleEn, titleAr, descEn and descAr are required',
      );
    }

    const existingSeo = await this.prisma.seo.findFirst({
      where: { page },
    });

    if (existingSeo) {
      throw new BadRequestException('SEO for this page already exists');
    }

    const seo = await this.prisma.seo.create({
      data: {
        page,
        titleEn,
        titleAr,
        descEn,
        descAr,
        keywordsEn,
        keywordsAr,
      },
    });

    return { seo };
  }

  async updateSeo(updateSeoDto: UpdateSeoDto) {
    const {
      id,
      page,
      titleEn,
      titleAr,
      descEn,
      descAr,
      keywordsEn,
      keywordsAr,
    } = updateSeoDto;

    const seoItem = await this.prisma.seo.findUnique({
      where: { id },
    });

    if (!seoItem) {
      throw new BadRequestException('SEO record not found');
    }

    if (page && page !== seoItem.page) {
      const existingSeo = await this.prisma.seo.findFirst({
        where: {
          page,
          NOT: { id },
        },
      });

      if (existingSeo) {
        throw new BadRequestException('SEO for this page already exists');
      }
    }

    const seo = await this.prisma.seo.update({
      where: { id },
      data: {
        page: page ?? seoItem.page,
        titleEn: titleEn ?? seoItem.titleEn,
        titleAr: titleAr ?? seoItem.titleAr,
        descEn: descEn ?? seoItem.descEn,
        descAr: descAr ?? seoItem.descAr,
        keywordsEn: keywordsEn ?? seoItem.keywordsEn,
        keywordsAr: keywordsAr ?? seoItem.keywordsAr,
      },
    });

    return { seo };
  }

  async deleteSeo(id: string) {
    const seoItem = await this.prisma.seo.findUnique({
      where: { id },
    });

    if (!seoItem) {
      throw new BadRequestException('SEO record not found');
    }

    await this.prisma.seo.delete({
      where: { id },
    });

    return {
      message: 'SEO record deleted successfully',
      success: true,
    };
  }

  async getSeos() {
    const seos = await this.prisma.seo.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return seos;
  }

  async getSeoByPage(page: string) {
    const seo = await this.prisma.seo.findFirst({
      where: { page },
    });

    if (!seo) {
      throw new BadRequestException('SEO data for this page not found');
    }

    return seo;
  }
}
