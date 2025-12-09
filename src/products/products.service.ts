import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductImageInput,
  ProductSizeInput,
  ProductSizeColorInput,
} from './dto/product.dto';
import { join } from 'path';
import * as fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  private async storeImageAndGetInfo(
    file: any,
  ): Promise<{ url: string; filename: string }> {
    const { createReadStream, filename } = await file;

    const uniqueFilename = `${uuidv4()}_${filename}`;
    const folder = 'imgs-products';

    const imagePath = join(process.cwd(), 'public', folder, uniqueFilename);
    const imageUrl = `${process.env.APP_URL}/${folder}/${uniqueFilename}`;

    const readStream = createReadStream();
    const writeStream = fs.createWriteStream(imagePath);

    await new Promise<void>((resolve, reject) => {
      readStream
        .pipe(writeStream)
        .on('finish', () => resolve())
        .on('error', (err) => reject(err));
    });

    return { url: imageUrl, filename: uniqueFilename };
  }

  private deleteImageFile(filename: string) {
    if (!filename) return;

    const folder = 'imgs-products';
    const fullImagePath = join(process.cwd(), 'public', folder, filename);

    fs.unlink(fullImagePath, (err: any) => {
      if (err) {
        // ممكن تعمل logging هنا لو حابب
      }
    });
  }

  private async handleImagesOnCreate(
    productId: string,
    images: ProductImageInput[] = [],
  ) {
    if (!images || images.length === 0) return;

    let sortOrder = 0;
    for (const img of images) {
      if (!img.file) continue;

      const { url, filename } = await this.storeImageAndGetInfo(img.file);

      await this.prisma.productImage.create({
        data: {
          productId,
          url,
          filename,
          isMain: !!img.isMain,
          linkedColorHex: img.linkedColorHex ?? null,
          sortOrder: img.sortOrder ?? sortOrder++,
        },
      });
    }
  }

  private async handleImagesOnUpdate(
    productId: string,
    images: ProductImageInput[] = [],
  ) {
    const existingImages = await this.prisma.productImage.findMany({
      where: { productId },
    });

    const existingImagesMap = new Map(
      existingImages.map((img) => [img.id, img]),
    );

    for (const img of images) {
      if (img.deleted && img.id && existingImagesMap.has(img.id)) {
        const existing = existingImagesMap.get(img.id)!;
        this.deleteImageFile(existing.filename);
        await this.prisma.productImage.delete({
          where: { id: existing.id },
        });
        existingImagesMap.delete(img.id);
      }
    }

    let sortOrder = 0;

    for (const img of images) {
      if (img.deleted) continue;

      if (img.file) {
        const { url, filename } = await this.storeImageAndGetInfo(img.file);

        await this.prisma.productImage.create({
          data: {
            productId,
            url,
            filename,
            isMain: !!img.isMain,
            linkedColorHex: img.linkedColorHex ?? null,
            sortOrder: img.sortOrder ?? sortOrder++,
          },
        });

        continue;
      }

      if (img.id && existingImagesMap.has(img.id)) {
        const existing = existingImagesMap.get(img.id)!;

        await this.prisma.productImage.update({
          where: { id: existing.id },
          data: {
            isMain: img.isMain ?? existing.isMain,
            linkedColorHex: img.linkedColorHex ?? existing.linkedColorHex,
            sortOrder: img.sortOrder ?? existing.sortOrder,
          },
        });
      }
    }
  }

  private async resetAndCreateSizes(
    productId: string,
    sizes: ProductSizeInput[] = [],
  ) {
    const oldSizes = await this.prisma.productSize.findMany({
      where: { productId },
      select: { id: true },
    });

    const oldSizeIds = oldSizes.map((s) => s.id);

    if (oldSizeIds.length > 0) {
      await this.prisma.productSizeColor.deleteMany({
        where: { sizeId: { in: oldSizeIds } },
      });
      await this.prisma.productSize.deleteMany({
        where: { id: { in: oldSizeIds } },
      });
    }

    for (const size of sizes) {
      const sizeRecord = await this.prisma.productSize.create({
        data: {
          productId,
          sizeValue: size.sizeValue,
          catalogSizeId: size.catalogSizeId ?? null,
          soldout: !!size.soldout,
        },
      });

      if (size.colors && size.colors.length > 0) {
        for (const color of size.colors as ProductSizeColorInput[]) {
          await this.prisma.productSizeColor.create({
            data: {
              sizeId: sizeRecord.id,
              hex: color.hex,
              catalogColorId: color.catalogColorId ?? null,
              nameEn: color.nameEn ?? null,
              nameAr: color.nameAr ?? null,
              soldout: !!color.soldout,
            },
          });
        }
      }
    }
  }

  private mapProductDecimals(product: any) {
    if (!product) return product;

    return {
      ...product,
      price:
        product.price !== undefined && product.price !== null
          ? Number(product.price)
          : product.price,
      estimatedPrice:
        product.estimatedPrice !== undefined && product.estimatedPrice !== null
          ? Number(product.estimatedPrice)
          : product.estimatedPrice,
    };
  }

  async createProduct(input: CreateProductInput) {
    const {
      name,
      categoryId,
      price,
      estimatedPrice,
      sku,
      publicPro = true,
      soldOut = false,
      descriptionEn,
      descriptionAr,
      keywordsEn = [],
      keywordsAr = [],
      images = [],
      sizes = [],
    } = input;

    if (!name || !categoryId || price == null) {
      throw new BadRequestException('name, categoryId and price are required');
    }

    const categoryExists = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!categoryExists) {
      throw new BadRequestException('Category does not exist');
    }

    const product = await this.prisma.product.create({
      data: {
        name,
        categoryId,
        price,
        estimatedPrice: estimatedPrice ?? null,
        sku: sku ?? null,
        publicPro,
        soldOut,
        descriptionEn: descriptionEn ?? null,
        descriptionAr: descriptionAr ?? null,
        keywordsEn,
        keywordsAr,
      },
    });

    await this.handleImagesOnCreate(product.id, images);

    await this.resetAndCreateSizes(product.id, sizes);

    const fullProduct = await this.prisma.product.findUnique({
      where: { id: product.id },
      include: {
        images: true,
        sizes: {
          include: {
            colors: true,
          },
        },
      },
    });

    const mapped = this.mapProductDecimals(fullProduct);

    return { product: mapped };
  }

  async updateProduct(input: UpdateProductInput) {
    const {
      id,
      name,
      categoryId,
      price,
      estimatedPrice,
      sku,
      publicPro,
      soldOut,
      descriptionEn,
      descriptionAr,
      keywordsEn,
      keywordsAr,
      images,
      sizes,
    } = input;

    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (categoryId) {
      const categoryExists = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });

      if (!categoryExists) {
        throw new BadRequestException('Category does not exist');
      }
    }

    const updatedProduct = await this.prisma.product.update({
      where: { id },
      data: {
        name: name ?? product.name,
        categoryId: categoryId ?? product.categoryId,
        price: price ?? product.price,
        estimatedPrice:
          estimatedPrice !== undefined
            ? estimatedPrice
            : product.estimatedPrice,
        sku: sku ?? product.sku,
        publicPro: publicPro ?? product.publicPro,
        soldOut: soldOut ?? product.soldOut,
        descriptionEn: descriptionEn ?? product.descriptionEn,
        descriptionAr: descriptionAr ?? product.descriptionAr,
        keywordsEn: keywordsEn ?? product.keywordsEn,
        keywordsAr: keywordsAr ?? product.keywordsAr,
      },
    });

    // Images
    if (images) {
      await this.handleImagesOnUpdate(updatedProduct.id, images);
    }

    if (sizes) {
      await this.resetAndCreateSizes(updatedProduct.id, sizes);
    }

    const fullProduct = await this.prisma.product.findUnique({
      where: { id: updatedProduct.id },
      include: {
        images: true,
        sizes: {
          include: { colors: true },
        },
      },
    });
    const mapped = this.mapProductDecimals(fullProduct);

    return { product: mapped };
  }

  async deleteProduct(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
      },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    if (product.images && product.images.length > 0) {
      for (const img of product.images) {
        this.deleteImageFile(img.filename);
      }
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: 'Product deleted successfully',
      success: true,
    };
  }

  async getProductsAdmin() {
    const products = await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: true,
        sizes: { include: { colors: true } },
      },
    });

    return products.map((p) => this.mapProductDecimals(p));
  }

  async getProductsPublic() {
    const products = await this.prisma.product.findMany({
      where: { publicPro: true },
      orderBy: { createdAt: 'desc' },
      include: {
        category: true,
        images: true,
        sizes: { include: { colors: true } },
      },
    });

    return products.map((p) => this.mapProductDecimals(p));
  }

  async getProductByIdAdmin(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        sizes: {
          include: { colors: true },
        },
      },
    });

    if (!product) {
      throw new BadRequestException('Product not found');
    }

    return this.mapProductDecimals(product);
  }

  private mapProductsDecimals(products: any[]) {
    if (!products) return [];
    return products.map((p) => this.mapProductDecimals(p));
  }

  async getProductByIdPublic(id: string) {
    const includeConfig = {
      category: true,
      images: true,
      sizes: {
        include: { colors: true },
      },
    };

    const product = await this.prisma.product.findFirst({
      where: {
        id,
        publicPro: true,
      },
      include: includeConfig,
    });

    if (!product) {
      throw new BadRequestException('Product not found or not public');
    }

    const relatedWhere = {
      categoryId: product.categoryId,
      publicPro: true,
      NOT: { id: product.id },
    };

    const totalRelated = await this.prisma.product.count({
      where: relatedWhere,
    });

    let relatedProductsRaw: any[] = [];

    if (totalRelated > 0) {
      if (totalRelated <= 4) {
        relatedProductsRaw = await this.prisma.product.findMany({
          where: relatedWhere,
          include: includeConfig,
        });
      } else {
        const maxSkip = totalRelated - 4;
        const randomSkip = Math.floor(Math.random() * (maxSkip + 1));

        relatedProductsRaw = await this.prisma.product.findMany({
          where: relatedWhere,
          include: includeConfig,
          skip: randomSkip,
          take: 4,
        });
      }
    }

    const mappedProduct = this.mapProductDecimals(product);
    const mappedRelated = this.mapProductsDecimals(relatedProductsRaw);

    return {
      product: mappedProduct,
      relatedProducts: mappedRelated,
    };
  }

  async getTopSellingProducts() {
    const products = await this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
      orderBy: {
        purchased: 'desc',
      },
      include: {
        category: true,
        images: true,
        sizes: { include: { colors: true } },
      },
    });
    return products.map((p) => this.mapProductDecimals(p));
  }

  async getTopSellingProductsHome() {
    const products = await this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
      orderBy: {
        purchased: 'desc',
      },
      take: 4,
      include: {
        category: true,
        images: true,
        sizes: { include: { colors: true } },
      },
    });
    return products.map((p) => this.mapProductDecimals(p));
  }

  async getRecentProducts() {
    const products = await this.prisma.product.findMany({
      where: {
        publicPro: true,
      },
      orderBy: {
        purchased: 'desc',
      },
      take: 4,
      include: {
        category: true,
        images: true,
        sizes: { include: { colors: true } },
      },
    });
    return products.map((p) => this.mapProductDecimals(p));
  }
}
