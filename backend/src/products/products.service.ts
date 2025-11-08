import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private mapProduct(p: any) {
    if (!p) return p;
    return {
      ...p,
      price: p.price != null ? Number(p.price) : p.price,
      originalPrice: p.originalPrice != null ? Number(p.originalPrice) : p.originalPrice,
    };
  }

  async create(createProductDto: CreateProductDto): Promise<any> {
    const product = await this.prisma.product.create({ data: createProductDto as any });
    return this.mapProduct(product);
  }

  async findAll(): Promise<any[]> {
    const products = await this.prisma.product.findMany();
    return products.map((p) => this.mapProduct(p));
  }

  async findOne(id: string): Promise<any> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.mapProduct(product);
  }

  async findByCategory(category: string): Promise<any[]> {
    const products = await this.prisma.product.findMany({ where: { category } });
    return products.map((p) => this.mapProduct(p));
  }

  async findFeatured(): Promise<any[]> {
    const products = await this.prisma.product.findMany({ where: { isFeatured: true } });
    return products.map((p) => this.mapProduct(p));
  }

  async update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<any> {
    const product = await this.prisma.product.update({ where: { id }, data: updateProductDto });
    return this.mapProduct(product);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch (e) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }
}
