import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { ColorDto, UpdateColorDto } from './dto/color.dto';

@Injectable()
export class ColorsService {
  constructor(private readonly prisma: PrismaService) {}

  async createColor(colorDto: ColorDto) {
    const { hex, nameEn, nameAr } = colorDto;

    if (!hex) {
      throw new BadRequestException('hex is required');
    }

    const existingColor = await this.prisma.catalogColor.findFirst({
      where: { hex },
    });

    if (existingColor) {
      throw new BadRequestException('Color with this hex already exists');
    }

    const color = await this.prisma.catalogColor.create({
      data: {
        hex,
        nameEn,
        nameAr,
      },
    });

    return { color };
  }

  async updateColor(updateColorDto: UpdateColorDto) {
    const { id, hex, nameEn, nameAr } = updateColorDto;

    const colorItem = await this.prisma.catalogColor.findUnique({
      where: { id },
    });

    if (!colorItem) {
      throw new BadRequestException('Color not found');
    }

    if (hex) {
      const existingColor = await this.prisma.catalogColor.findFirst({
        where: {
          hex,
          NOT: { id },
        },
      });

      if (existingColor) {
        throw new BadRequestException('Color with this hex already exists');
      }
    }

    const color = await this.prisma.catalogColor.update({
      where: { id },
      data: {
        hex: hex ?? colorItem.hex,
        nameEn: nameEn ?? colorItem.nameEn,
        nameAr: nameAr ?? colorItem.nameAr,
      },
    });

    return { color };
  }

  async deleteColor(id: string) {
    const colorItem = await this.prisma.catalogColor.findUnique({
      where: { id },
    });

    if (!colorItem) {
      throw new BadRequestException('Color not found');
    }

    const usedCount = await this.prisma.productSizeColor.count({
      where: { catalogColorId: id },
    });

    if (usedCount > 0) {
      throw new BadRequestException(
        'Cannot delete color because it is used by products',
      );
    }

    await this.prisma.catalogColor.delete({
      where: { id },
    });

    return {
      message: 'Color deleted successfully',
      success: true,
    };
  }

  async getColors() {
    const colors = await this.prisma.catalogColor.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return colors;
  }
}
