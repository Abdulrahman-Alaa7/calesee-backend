import { Test, TestingModule } from '@nestjs/testing';
import { ColorsResolver } from './colors.resolver';
import { ColorsService } from './colors.service';

describe('ColorsResolver', () => {
  let resolver: ColorsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ColorsResolver, ColorsService],
    }).compile();

    resolver = module.get<ColorsResolver>(ColorsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
