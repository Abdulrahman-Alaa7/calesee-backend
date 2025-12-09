import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { SizeDto, UpdateSizeDto } from './dto/size.dto';

@Injectable()
export class SizesService {
  constructor(private readonly prisma: PrismaService) {}

  async createSize(sizeDto: SizeDto) {
    const { valueSize, labelEn, labelAr } = sizeDto;

    if (!valueSize) {
      throw new BadRequestException('valueSize is required');
    }

    const existingSize = await this.prisma.catalogSize.findFirst({
      where: { valueSize },
    });

    if (existingSize) {
      throw new BadRequestException('Size with this valueSize already exists');
    }

    const size = await this.prisma.catalogSize.create({
      data: {
        valueSize,
        labelEn,
        labelAr,
      },
    });

    return { size };
  }

  async updateSize(updateSizeDto: UpdateSizeDto) {
    const { id, valueSize, labelEn, labelAr } = updateSizeDto;

    const sizeItem = await this.prisma.catalogSize.findUnique({
      where: { id },
    });

    if (!sizeItem) {
      throw new BadRequestException('Size not found');
    }

    if (valueSize) {
      const existingSize = await this.prisma.catalogSize.findFirst({
        where: {
          valueSize,
          NOT: { id },
        },
      });

      if (existingSize) {
        throw new BadRequestException(
          'Size with this valueSize already exists',
        );
      }
    }

    const size = await this.prisma.catalogSize.update({
      where: { id },
      data: {
        valueSize: valueSize ?? sizeItem.valueSize,
        labelEn: labelEn ?? sizeItem.labelEn,
        labelAr: labelAr ?? sizeItem.labelAr,
      },
    });

    return { size };
  }

  async deleteSize(id: string) {
    const sizeItem = await this.prisma.catalogSize.findUnique({
      where: { id },
    });

    if (!sizeItem) {
      throw new BadRequestException('Size not found');
    }

    const usedCount = await this.prisma.productSize.count({
      where: { catalogSizeId: id },
    });

    if (usedCount > 0) {
      throw new BadRequestException(
        'Cannot delete size because it is used by products',
      );
    }

    await this.prisma.catalogSize.delete({
      where: { id },
    });

    return {
      message: 'Size deleted successfully',
      success: true,
    };
  }

  async getSizes() {
    const sizes = await this.prisma.catalogSize.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return sizes;
  }
}
