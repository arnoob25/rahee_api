import { Test, TestingModule } from '@nestjs/testing';
import { RoomTypeResolver } from './room-type.resolver';

describe('RoomTypeResolver', () => {
  let resolver: RoomTypeResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RoomTypeResolver],
    }).compile();

    resolver = module.get<RoomTypeResolver>(RoomTypeResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
