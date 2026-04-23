import { Controller, Get, Header } from '@nestjs/common';
import { FeedService } from './feed.service';

@Controller()
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get('products-feed.xml')
  @Header('Content-Type', 'application/xml')
  async getProductsFeed() {
    return this.feedService.generateProductsFeed();
  }
}
