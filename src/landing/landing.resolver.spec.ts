import { Test, TestingModule } from '@nestjs/testing';
import { LandingResolver } from './landing.resolver';
import { LandingService } from './landing.service';

describe('LandingResolver', () => {
  let resolver: LandingResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LandingResolver, LandingService],
    }).compile();

    resolver = module.get<LandingResolver>(LandingResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
