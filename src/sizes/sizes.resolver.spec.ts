import { Test, TestingModule } from '@nestjs/testing';
import { SizesResolver } from './sizes.resolver';
import { SizesService } from './sizes.service';

describe('SizesResolver', () => {
  let resolver: SizesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SizesResolver, SizesService],
    }).compile();

    resolver = module.get<SizesResolver>(SizesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
