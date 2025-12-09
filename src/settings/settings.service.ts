import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SettingsDto, SettingsUpdateDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSettings(settingsDto: SettingsDto) {
    const {
      shippingPrice,
      freeShippingPrice,
      freeShipDescEn,
      freeShipDescAr,
      address,
      airPlaneMode,
    } = settingsDto;

    const settings = await this.prisma.settings.create({
      data: {
        shippingPrice,
        freeShippingPrice,
        freeShipDescEn,
        freeShipDescAr,
        address,
        airPlaneMode,
      },
    });
    return { settings };
  }

  async updateSettings(settingsUpdateDto: SettingsUpdateDto) {
    const {
      id,
      shippingPrice,
      freeShippingPrice,
      freeShipDescEn,
      freeShipDescAr,
      address,
      airPlaneMode,
    } = settingsUpdateDto;
    const idSettings = id;

    const settings = await this.prisma.settings.update({
      where: {
        id: idSettings,
      },
      data: {
        shippingPrice,
        freeShippingPrice,
        freeShipDescEn,
        freeShipDescAr,
        address,
        airPlaneMode,
      },
    });

    return { settings };
  }

  async getSettings() {
    const settings = await this.prisma.settings.findMany({});

    return settings;
  }
}
