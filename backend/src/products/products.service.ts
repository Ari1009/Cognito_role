import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  private map(p: any) {
    if (!p) return p;
    return {
      ...p,
      price: p.price != null ? Number(p.price) : p.price,
      originalPrice: p.originalPrice != null ? Number(p.originalPrice) : p.originalPrice,
    };
  }

  async create(createProductDto: CreateProductDto): Promise<any> {
    const product = await this.prisma.product.create({ data: createProductDto as any });
    return this.map(product);
  }

  async findAll(): Promise<any[]> {
    const products = await this.prisma.product.findMany();
    return products.map((p) => this.map(p));
  }

  async findOne(id: string): Promise<any> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return this.map(product);
  }

  async findByCategory(category: string): Promise<any[]> {
    const products = await this.prisma.product.findMany({ where: { category } });
    return products.map((p) => this.map(p));
  }

  async findFeatured(): Promise<any[]> {
    const products = await this.prisma.product.findMany({ where: { isFeatured: true } });
    return products.map((p) => this.map(p));
  }

  async update(id: string, updateProductDto: Partial<CreateProductDto>): Promise<any> {
    const product = await this.prisma.product.update({ where: { id }, data: updateProductDto });
    return this.map(product);
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.product.delete({ where: { id } });
    } catch {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
  }

  async seedDefaults() {
    const defaults = [
      { brand: 'NestFood', rating: 4, category: 'Snack', name: 'Fresh organic villa farm lomon 500gm pack', price: 28.9, image: '/images/p1.png', isFeatured: false, badge: null },
      { brand: 'Hodo Foods', rating: 4, category: 'Snack', name: 'Best snakes with hazel nut pack 200gm', price: 52.85, image: '/images/p13.png', isFeatured: false, badge: null },
      { brand: 'StarKist', rating: 4, category: 'Snack', name: 'Organic fresh venila farm watermelon  5kg', price: 48.85, image: '/images/p11.png', isFeatured: false, badge: null },
      { brand: 'NestFood', rating: 4, category: 'Vegetables', name: 'Fresh organic apple 1kg simla marming', price: 17.85, image: '/images/p9.png', isFeatured: false, badge: null },
      { brand: 'NestFood', rating: 4, category: 'Pet Foods', name: 'Blue Diamond Almonds Lightly Salted Vegetables', price: 23.9, image: '/images/p7.png', isFeatured: false, badge: null },
      { brand: 'NestFood', rating: 4, category: 'Hodo Foods', name: 'Chobani Complete Vanilla Greek Yogurt', price: 54.85, image: '/images/p6.png', isFeatured: false, badge: null },
      { brand: 'NestFood', rating: 4, category: 'Meats', name: 'Canada Dry Ginger Ale - 2 L Bottle - 200ml - 400g', price: 32.85, image: '/images/p8.jpg', isFeatured: false, badge: null },
      { brand: 'NestFood', rating: 4, category: 'Cream', name: 'Encore Seafoods Stuffed Alaskan Salmon', price: 35.85, image: '/images/p4.png', isFeatured: false, badge: null },
      { brand: 'Old El Paso', rating: 4, category: 'Coffes', name: 'Gorton’s Beer Battered Fish Fillets with soft paper', price: 23.85, image: '/images/p3.png', isFeatured: false, badge: null },
      { brand: 'Tyson', rating: 2, category: 'Cream', name: 'Haagen-Dazs Caramel Cone Ice Cream Ketchup', price: 22.85, image: '/images/p2.png', isFeatured: false, badge: null },
      { brand: 'NestFood', rating: 4, category: 'Hodo Foods', name: 'All Natural Italian-Style Chicken Meatballs', price: 238.85, image: '/images/p7.png', isFeatured: true, badge: null },
      { brand: 'NestFood', rating: 4, category: 'Hodo Foods', name: 'Angie’s Boomchickapop Sweet and womnies', price: 238.85, image: '/images/p14.png', isFeatured: true, badge: null },
      { brand: 'NestFood', rating: 4, category: 'Hodo Foods', name: 'Foster Farms Takeout Crispy Classic', price: 238.85, image: '/images/p12.png', isFeatured: true, badge: null },
      { brand: 'NestFood', rating: 4, category: 'Hodo Foods', name: 'Blue Diamond Almonds Lightly Salted', price: 238.85, image: '/images/p10.png', isFeatured: true, badge: null },
      { brand: 'NestFood', rating: 4, category: 'Hodo Foods', name: 'Seeds of Change Organic Quinoa,Brown, & Red Rice', price: 32.85, image: '/images/p4.png', isFeatured: false, badge: 'sale' },
      { brand: 'By Old El Paso', rating: 4, category: 'Hodo Foods', name: 'Perdue Simply Smart Organics Gluten Free', price: 24.85, image: '/images/p3.png', isFeatured: false, badge: 'sale' },
      { brand: 'Progresso', rating: 3, category: 'Hodo Foods', name: 'Signature Wood-Fired Mushroom and Caramelized', price: 12.85, image: '/images/p2.png', isFeatured: false, badge: 'sale' },
      { brand: 'Yoplait', rating: 3, category: 'Hodo Foods', name: 'Simply Lemonade with Raspberry Juice', price: 15.85, image: '/images/p1.png', isFeatured: false, badge: 'sale' },
    ];

    let inserted = 0;
    for (const d of defaults) {
      const exists = await this.prisma.product.findFirst({ where: { name: d.name } });
      if (exists) continue;
      await this.prisma.product.create({
        data: {
          name: d.name,
          description: d.name,
          price: d.price,
          image: d.image,
          category: d.category,
          brand: d.brand,
          rating: d.rating,
          reviewCount: 40,
          stock: 100,
          isFeatured: d.isFeatured,
          badge: d.badge as any,
        },
      });
      inserted += 1;
    }

    return { inserted };
  }
}
