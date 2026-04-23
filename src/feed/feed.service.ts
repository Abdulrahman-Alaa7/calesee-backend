import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FeedService {
  constructor(private readonly prisma: PrismaService) {}
  private cachedXml: string | null = null;
  private cacheTimestamp = 0;
  private CACHE_TTL = 15 * 60 * 1000;

  async getProductsForFeed() {
    return this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
      include: {
        images: true,
        sizes: {
          include: { colors: true },
        },
      },
      orderBy: {
        updatedAt: 'desc',
      },
    });
  }

  private generateXml(products: any[]) {
    const items = products
      .map((product) => {
        const mainImage =
          product.images.find((img) => img.isMain)?.url ||
          product.images[0]?.url ||
          '';

        const finalPrice =
          product.estimatedPrice && product.estimatedPrice > 0
            ? product.estimatedPrice
            : product.price;

        const availability = product.soldOut ? 'out of stock' : 'in stock';

        return `
      <item>
        <id>${product.id}</id>
        <title><![CDATA[${product.name}]]></title>
        <description><![CDATA[${
          product.descriptionEn || product.descriptionAr || ''
        }]]></description>
        <link>${process.env.CLIENT_SIDE_URI}/en/store/${product.id}</link>
        <image_link>${mainImage}</image_link>
        <price>${Number(finalPrice).toFixed(2)} EGP</price>
        <availability>${availability}</availability>
        <condition>new</condition>
        <brand>Calesee</brand>
      </item>
    `;
      })
      .join('');

    return `
    <rss version="2.0">
      <channel>
        <title>Calesee Products</title>
        ${items}
      </channel>
    </rss>
  `;
  }

  async generateProductsFeed() {
    const now = Date.now();

    if (this.cachedXml && now - this.cacheTimestamp < this.CACHE_TTL) {
      return this.cachedXml;
    }

    const products = await this.getProductsForFeed();
    const xml = this.generateXml(products);

    this.cachedXml = xml;
    this.cacheTimestamp = now;

    return xml;
  }
}
