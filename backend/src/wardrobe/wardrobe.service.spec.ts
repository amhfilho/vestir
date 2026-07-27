import { NotFoundException } from '@nestjs/common';
import { WardrobeService } from './wardrobe.service';
import { PrismaService } from '../prisma/prisma.service';

describe('WardrobeService', () => {
  const file = {
    buffer: Buffer.from('bytes'),
    originalname: 'shirt.jpg',
  } as Express.Multer.File;

  const analysis = {
    type: 'T-Shirt',
    colors: ['white'],
    style: 'casual',
    occasions: ['everyday'],
    pattern: 'solid',
    estimatedMaterial: 'cotton',
    description: 'A white solid T-Shirt.',
  };

  let storage: { save: jest.Mock };
  let vision: { analyze: jest.Mock };
  let embeddings: { embed: jest.Mock };
  let prisma: {
    garment: { create: jest.Mock; findMany: jest.Mock; findUnique: jest.Mock };
    $executeRaw: jest.Mock;
  };
  let service: WardrobeService;

  beforeEach(() => {
    storage = { save: jest.fn().mockResolvedValue({ path: 'abc-shirt.jpg' }) };
    vision = { analyze: jest.fn().mockResolvedValue(analysis) };
    embeddings = { embed: jest.fn().mockResolvedValue([0.1, 0.2, 0.3]) };
    prisma = {
      garment: {
        create: jest
          .fn()
          .mockResolvedValue({ id: 'garment-1', imagePath: 'abc-shirt.jpg' }),
        findMany: jest.fn().mockResolvedValue([]),
        findUnique: jest.fn().mockResolvedValue(null),
      },
      $executeRaw: jest.fn().mockResolvedValue(1),
    };

    service = new WardrobeService(
      prisma as unknown as PrismaService,
      storage,
      vision,
      embeddings,
    );
  });

  describe('createFromUpload', () => {
    it('stores the image, analyzes it, embeds the description, and persists the garment', async () => {
      const result = await service.createFromUpload(file);

      expect(storage.save).toHaveBeenCalledWith(file.buffer, file.originalname);
      expect(vision.analyze).toHaveBeenCalledWith(file.buffer);
      expect(embeddings.embed).toHaveBeenCalledWith(analysis.description);
      expect(prisma.garment.create).toHaveBeenCalledWith({
        data: {
          imagePath: 'abc-shirt.jpg',
          type: analysis.type,
          colors: analysis.colors,
          style: analysis.style,
          occasions: analysis.occasions,
          pattern: analysis.pattern,
          estimatedMaterial: analysis.estimatedMaterial,
          description: analysis.description,
        },
      });
      expect(prisma.$executeRaw).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ id: 'garment-1', imagePath: 'abc-shirt.jpg' });
    });
  });

  describe('findAll', () => {
    it('delegates to prisma.garment.findMany', async () => {
      await service.findAll();

      expect(prisma.garment.findMany).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    it('returns the garment when found', async () => {
      prisma.garment.findUnique.mockResolvedValue({ id: 'garment-1' });

      const result = await service.findOne('garment-1');

      expect(result).toEqual({ id: 'garment-1' });
    });

    it('throws NotFoundException when the garment does not exist', async () => {
      await expect(service.findOne('missing')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
