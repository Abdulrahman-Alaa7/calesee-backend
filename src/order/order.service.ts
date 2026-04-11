import {
  BadRequestException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import {
  CreateOrderInput,
  OrderItemInput,
  UpdateOrderStatusInput,
} from './dto/order.dto';
import { EmailService } from '../email/email.service';
import { OrderGateway } from './order.gateway';
import * as cron from 'node-cron';
import { Status } from '../../prisma/generated/client';

@Injectable()
export class OrderService implements OnModuleInit {
  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly orderGateway: OrderGateway,
  ) {}
  private readonly logger = new Logger(OrderService.name);

  onModuleInit() {
    this.scheduleOrderCleanup();
  }

  private scheduleOrderCleanup() {
    cron.schedule('0 0 0 * * *', async () => {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      await this.prisma.order.deleteMany({
        where: {
          createdAt: { lt: sixMonthsAgo },
        },
      });
    });
  }

  private getMsg(
    lang: string,
    key: string,
    params?: Record<string, any>,
  ): string {
    const isAr = lang === 'ar';

    const dict: Record<string, { ar: string; en: string }> = {
      AIRPLANE_MODE: {
        ar: 'عذرًا، الطلبات متوقفة حاليًا. برجاء المحاولة لاحقًا.',
        en: 'Sorry, we are not accepting orders right now. Please try again later.',
      },
      EMPTY_CART: {
        ar: 'لا يمكن إنشاء طلب بدون منتجات.',
        en: 'You cannot create an order with an empty cart.',
      },
      PRODUCT_NOT_FOUND: {
        ar: `المنتج المطلوب لم يعد متاحًا، برجاء إزالة المنتج من السلة.`,
        en: `The requested product is no longer available. Please remove it from your cart.`,
      },
      PRODUCT_SOLD_OUT: {
        ar: `المنتج المطلوب غير متاح حاليًا (نفد من المخزون).`,
        en: `The requested product is currently sold out.`,
      },
      SIZE_NOT_FOUND: {
        ar: `المقاس المختار لم يعد متاحًا لهذا المنتج، برجاء اختيار مقاس آخر.`,
        en: `The selected size is no longer available for this product. Please choose another size.`,
      },
      SIZE_SOLD_OUT: {
        ar: `المقاس المختار نفد من المخزون، برجاء اختيار مقاس آخر.`,
        en: `The selected size is sold out. Please choose another size.`,
      },
      COLOR_NOT_FOUND: {
        ar: `اللون المختار لم يعد متاحًا لهذا المقاس، برجاء اختيار لون آخر.`,
        en: `The selected color is no longer available for this size. Please choose another color.`,
      },
      COLOR_SOLD_OUT: {
        ar: `اللون المختار نفد من المخزون، برجاء اختيار لون آخر.`,
        en: `The selected color is sold out. Please choose another color.`,
      },
      PRICE_CHANGED: {
        ar: `تم تحديث سعر المنتج "{{name}}". السعر الحالي هو {{price}}. برجاء تحديث سلة التسوق قبل إكمال الطلب.`,
        en: `The price of "{{name}}" has changed. Current price is {{price}}. Please update your cart before placing the order.`,
      },
      ORDER_CREATED: {
        ar: 'تم إنشاء الطلب بنجاح.',
        en: 'Order created successfully.',
      },
      ORDER_NOT_FOUND: {
        ar: 'الطلب غير موجود.',
        en: 'Order not found.',
      },
      ORDER_DELETED: {
        ar: 'تم حذف الطلب بنجاح.',
        en: 'Order deleted successfully.',
      },
    };

    let msg = dict[key]?.[isAr ? 'ar' : 'en'] ?? key;

    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        msg = msg.replace(`{{${k}}}`, String(v));
      });
    }

    return msg;
  }

  async createOrder(input: CreateOrderInput) {
    const {
      fullName,
      email,
      phone_number,
      secPhone_number,
      governorate,
      secGovernorate,
      city,
      secCity,
      address,
      secAddress,
      note,
      orderItems,
      lang,
    } = input;

    if (!orderItems || orderItems.length === 0) {
      throw new BadRequestException(this.getMsg(lang, 'EMPTY_CART'));
    }

    const settings = await this.prisma.settings.findFirst({});
    if (settings && settings.airPlaneMode === true) {
      throw new BadRequestException(this.getMsg(lang, 'AIRPLANE_MODE'));
    }

    const productIds = [...new Set(orderItems.map((i) => i.productId))];

    const products = await this.prisma.product.findMany({
      where: {
        id: { in: productIds },
        publicPro: true,
      },
      include: {
        sizes: {
          include: {
            colors: true,
          },
        },
      },
    });

    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;

    const orderItemsData: {
      productId: string;
      name: string;
      img: string;
      price: number;
      color?: string | null;
      size?: string | null;
      quantity: number;
    }[] = [];

    for (const item of orderItems) {
      const product = productMap.get(item.productId);

      if (!product) {
        throw new BadRequestException(this.getMsg(lang, 'PRODUCT_NOT_FOUND'));
      }

      if (product.soldOut) {
        throw new BadRequestException(this.getMsg(lang, 'PRODUCT_SOLD_OUT'));
      }

      let sizeRecord: any = null;
      if (item.size) {
        sizeRecord = product.sizes.find((s) => s.sizeValue === item.size);
        if (!sizeRecord) {
          throw new BadRequestException(this.getMsg(lang, 'SIZE_NOT_FOUND'));
        }
        if (sizeRecord.soldout) {
          throw new BadRequestException(this.getMsg(lang, 'SIZE_SOLD_OUT'));
        }
      }

      if (item.color && sizeRecord) {
        const colorRecord = sizeRecord.colors.find(
          (c) =>
            c.hex.toLowerCase() === item.color.toLowerCase() ||
            c.nameEn?.toLowerCase() === item.color.toLowerCase() ||
            c.nameAr?.toLowerCase() === item.color.toLowerCase(),
        );

        if (!colorRecord) {
          throw new BadRequestException(this.getMsg(lang, 'COLOR_NOT_FOUND'));
        }

        if (colorRecord.soldout) {
          throw new BadRequestException(this.getMsg(lang, 'COLOR_SOLD_OUT'));
        }
      }

      const currentPrice =
        Number(product.estimatedPrice) > 0
          ? Number(product.estimatedPrice)
          : Number(product.price);

      if (currentPrice !== Number(item.price)) {
        throw new BadRequestException(
          this.getMsg(lang, 'PRICE_CHANGED', {
            name: product.name,
            price: currentPrice,
          }),
        );
      }

      subtotal += currentPrice * item.quantity;

      orderItemsData.push({
        productId: product.id,
        name: item.name || product.name,
        img: item.img,
        price: currentPrice,
        color: item.color ?? null,
        size: item.size ?? null,
        quantity: item.quantity,
      });
    }

    const shippingPrice = settings?.shippingPrice ?? 0;
    const freeShippingPrice = settings?.freeShippingPrice ?? null;

    const shippingCost =
      freeShippingPrice && subtotal >= freeShippingPrice ? 0 : shippingPrice;

    const totalPrice = subtotal + shippingCost;

    const [order] = await this.prisma.$transaction([
      this.prisma.order.create({
        data: {
          fullName,
          email,
          phone_number,
          secPhone_number,
          governorate,
          secGovernorate,
          city,
          secCity,
          address,
          secAddress,
          note,
          status: Status.Pending,
          items: {
            create: orderItemsData,
          },
        },
        include: {
          items: true,
        },
      }),
      ...orderItems.map((item: OrderItemInput) =>
        this.prisma.product.update({
          where: { id: item.productId },
          data: {
            purchased: {
              increment: item.quantity,
            },
          },
        }),
      ),
    ]);

    await this.prisma.notification.create({
      data: {
        message: `New order from ${fullName}`,
        theId: order.id,
      },
    });

    this.orderGateway.sendOrderNotification({
      message: `New order from ${fullName}`,
      theId: order.id,
    });

    if (input.email && input.email.trim() !== '') {
      try {
        await this.emailService.sendMail({
          subject:
            lang === 'ar'
              ? 'تأكيد طلبك من Calesee'
              : 'Your Calesee order confirmation',
          email,
          name: fullName,
          activationCode: fullName,
          template:
            lang === 'ar'
              ? './order-confirmation-ar.ejs'
              : './order-confirmation.ejs',
          order: {
            id: order.id.toString().slice(0, 6),
            date: order.createdAt.toISOString(),
            theShippingPrice: shippingCost,
            products: order.items.map((it) => ({
              name: it.name,
              quantity: it.quantity,
              price: it.price,
            })),
            totalPrice,
          },
        });
      } catch (e) {
        console.log('MAIL ERROR =====>', e);
        this.logger.error(
          `Failed to send order confirmation email for order ${order.id}`,
          e instanceof Error ? e.stack : (e as any),
        );
      }
    }
    return {
      order,
    };
  }

  async getOrders() {
    return await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: { items: true },
    });
  }

  async getOrderById(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!order) {
      throw new BadRequestException(this.getMsg('en', 'ORDER_NOT_FOUND'));
    }

    return order;
  }

  async updateOrderStatus(input: UpdateOrderStatusInput) {
    const { id, status } = input;

    const exists = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new BadRequestException(this.getMsg('en', 'ORDER_NOT_FOUND'));
    }

    return await this.prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }

  async deleteOrder(id: string) {
    const exists = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new BadRequestException(this.getMsg('en', 'ORDER_NOT_FOUND'));
    }

    await this.prisma.order.delete({
      where: { id },
    });

    return { message: this.getMsg('en', 'ORDER_DELETED') };
  }

  async getRecentOrders() {
    const recentOrders = await this.prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      take: 7,
      include: { items: true },
    });

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const ordersThisMonthCount = await this.prisma.order.count({
      where: {
        createdAt: { gte: startOfMonth },
      },
    });

    return {
      recentOrders,
      ordersThisMonthCount,
    };
  }
}
