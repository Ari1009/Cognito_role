import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor() {
    const url = process.env.DATABASE_URL || PrismaService.composeUrlFromTypeOrmEnv();
    super({ datasources: { db: { url } } });
  }

  private static composeUrlFromTypeOrmEnv(): string {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '5432';
    const database = process.env.DB_DATABASE || 'postgres';
    const username = process.env.DB_USERNAME || 'postgres';
    const password = process.env.DB_PASSWORD || '';
    const auth = username ? `${encodeURIComponent(username)}:${encodeURIComponent(password)}@` : '';
    return `postgresql://${auth}${host}:${port}/${database}?schema=public`;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
