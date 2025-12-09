import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { UsersModule } from './users/users.module';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from './users/users.service';
import { UsersResolver } from './users/users.resolver';
import { EmailModule } from './email/email.module';
import { SettingsModule } from './settings/settings.module';
import { CategoriesModule } from './categories/categories.module';
import { ColorsModule } from './colors/colors.module';
import { SizesModule } from './sizes/sizes.module';
import { LandingModule } from './landing/landing.module';
import { SeoModule } from './seo/seo.module';
import { ProductsModule } from './products/products.module';
import { OrderModule } from './order/order.module';
import { AnalyticsModule } from './analytics/analytics.module';
import { NotificationModule } from './notification/notification.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { OrderGateway } from './order/order.gateway';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 600,
        limit: 100,
      },
    ]),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/../schema.gql'),
      context: ({ req, res }) => ({ req, res }),
      playground: false,
    }),
    UsersModule,
    EmailModule,
    SettingsModule,
    CategoriesModule,
    ColorsModule,
    SizesModule,
    LandingModule,
    SeoModule,
    ProductsModule,
    OrderModule,
    AnalyticsModule,
    NotificationModule,
  ],
  controllers: [],
  providers: [
    PrismaService,
    JwtService,
    ConfigService,
    UsersService,
    UsersResolver,
    OrderGateway,
  ],
})
export class AppModule {}
