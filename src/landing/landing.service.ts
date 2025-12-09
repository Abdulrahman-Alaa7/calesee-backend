import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { LandingDto, UpdateLandingDto } from './dto/landing.dto';
import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@Injectable()
export class LandingService {
  constructor(private readonly prisma: PrismaService) {}

  async createLanding(landingDto: LandingDto) {
    const {
      titleEn,
      titleAr,
      descEn,
      descAr,
      link,
      linkTitleEn,
      linkTitleAr,
      image,
    } = landingDto;

    if (
      !titleEn ||
      !titleAr ||
      !descEn ||
      !descAr ||
      !link ||
      !linkTitleEn ||
      !linkTitleAr ||
      !image
    ) {
      throw new BadRequestException(
        'titleEn, titleAr, descEn, descdAr, link and image are required',
      );
    }

    const imageUrl = await this.storeImageAndGetURL(image);

    const landing = await this.prisma.landing.create({
      data: {
        titleEn,
        titleAr,
        descEn,
        descAr,
        link,
        linkTitleEn,
        linkTitleAr,
        image: imageUrl,
      },
    });

    return { landing };
  }

  async updateLanding(updateLandingDto: UpdateLandingDto) {
    const {
      id,
      titleEn,
      titleAr,
      descEn,
      descAr,
      link,
      linkTitleEn,
      linkTitleAr,
      image,
    } = updateLandingDto;

    const landingItem = await this.prisma.landing.findUnique({
      where: { id },
    });

    if (!landingItem) {
      throw new BadRequestException('Landing not found');
    }

    let imageUrl: string = landingItem.image;

    if (image) {
      if (landingItem.image) {
        const imagePath = landingItem.image.replace(
          `${process.env.APP_URL}/`,
          '',
        );
        const fullImagePath = join(process.cwd(), 'public', imagePath);

        fs.unlink(fullImagePath, (err: any) => {
          if (err) {
            // ممكن تعمل logging هنا
          }
        });
      }

      imageUrl = await this.storeImageAndGetURL(image);
    }

    const landing = await this.prisma.landing.update({
      where: { id },
      data: {
        titleEn: titleEn ?? landingItem.titleEn,
        titleAr: titleAr ?? landingItem.titleAr,
        descEn: descEn ?? landingItem.descEn,
        descAr: descAr ?? landingItem.descAr,
        link: link ?? landingItem.link,
        linkTitleEn: linkTitleEn ?? landingItem.linkTitleEn,
        linkTitleAr: linkTitleAr ?? landingItem.linkTitleAr,
        image: imageUrl,
      },
    });

    return { landing };
  }

  async deleteLanding(id: string) {
    const landingItem = await this.prisma.landing.findUnique({
      where: { id },
    });

    if (!landingItem) {
      throw new BadRequestException('Landing not found');
    }

    if (landingItem.image) {
      const imagePath = landingItem.image.replace(
        `${process.env.APP_URL}/`,
        '',
      );
      const fullImagePath = join(process.cwd(), 'public', imagePath);

      fs.unlink(fullImagePath, (err: any) => {
        if (err) {
          // logging لو حابب
        }
      });
    }

    await this.prisma.landing.delete({
      where: { id },
    });

    return {
      message: 'Landing deleted successfully',
      success: true,
    };
  }

  async getLandings() {
    const landings = await this.prisma.landing.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return landings;
  }

  private async storeImageAndGetURL(file: GraphQLUpload): Promise<string> {
    const { createReadStream, filename } = await file;

    const uniqueFilename = `${uuidv4()}_${filename}`;
    const folder = 'imgs-landing';

    const imagePath = join(process.cwd(), 'public', folder, uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/${folder}/${uniqueFilename}`;

    const readStream = createReadStream();
    const writeStream = fs.createWriteStream(imagePath);
    readStream.pipe(writeStream);

    return imageUrl;
  }
}
