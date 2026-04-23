import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { SettingsDto, SettingsUpdateDto } from './dto/settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  async createSettings(settingsDto: SettingsDto) {
    const {
      defaultShippingPrice,
      freeShippingPrice,
      freeShipDescEn,
      freeShipDescAr,
      address,
      airPlaneMode,
    } = settingsDto;

    const settings = await this.prisma.settings.create({
      data: {
        defaultShippingPrice,
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
      defaultShippingPrice,
      freeShippingPrice,
      freeShipDescEn,
      freeShipDescAr,
      address,
      airPlaneMode,
    } = settingsUpdateDto;

    const settings = await this.prisma.settings.update({
      where: { id },
      data: {
        defaultShippingPrice,
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
    return await this.prisma.settings.findMany({});
  }

  async getShippingZones() {
    return await this.prisma.shippingZone.findMany({
      orderBy: { governorate: 'asc' },
    });
  }

  async upsertShippingZone(governorate: string, price: number) {
    return await this.prisma.shippingZone.upsert({
      where: { governorate },
      update: { price },
      create: { governorate, price },
    });
  }

  async deleteShippingZone(governorate: string) {
    const exists = await this.prisma.shippingZone.findUnique({
      where: { governorate },
    });
    if (!exists) {
      throw new BadRequestException('Shipping zone not found');
    }
    await this.prisma.shippingZone.delete({ where: { governorate } });
    return { message: 'Shipping zone removed successfully' };
  }

  async getShippingPrice(governorate: string) {
    const zone = await this.prisma.shippingZone.findUnique({
      where: { governorate },
    });
    if (zone) {
      return { price: zone.price, isDefault: false };
    }
    const settings = await this.prisma.settings.findFirst({});
    return { price: settings?.defaultShippingPrice ?? 0, isDefault: true };
  }
}
