import { Test, TestingModule } from '@nestjs/testing';
import { SeoResolver } from './seo.resolver';
import { SeoService } from './seo.service';

describe('SeoResolver', () => {
  let resolver: SeoResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SeoResolver, SeoService],
    }).compile();

    resolver = module.get<SeoResolver>(SeoResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
