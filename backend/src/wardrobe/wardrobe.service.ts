import { Injectable, NotFoundException } from '@nestjs/common';
import type { Garment } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
import { VisionAnalysisService } from '../claude-vision/vision-analysis.service';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { toPgVectorLiteral } from './pgvector.util';

@Injectable()
export class WardrobeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly storage: StorageService,
    private readonly vision: VisionAnalysisService,
    private readonly embeddings: EmbeddingsService,
  ) {}

  async createFromUpload(file: Express.Multer.File): Promise<Garment> {
    const stored = await this.storage.save(file.buffer, file.originalname);
    const analysis = await this.vision.analyze(file.buffer);
    const embedding = await this.embeddings.embed(analysis.description);

    const garment = await this.prisma.garment.create({
      data: {
        imagePath: stored.path,
        type: analysis.type,
        colors: analysis.colors,
        style: analysis.style,
        occasions: analysis.occasions,
        pattern: analysis.pattern,
        estimatedMaterial: analysis.estimatedMaterial,
        description: analysis.description,
      },
    });

    await this.prisma.$executeRaw`
      UPDATE "garments" SET embedding = ${toPgVectorLiteral(embedding)}::vector WHERE id = ${garment.id}
    `;

    return garment;
  }

  findAll(): Promise<Garment[]> {
    return this.prisma.garment.findMany({ orderBy: { createdAt: 'desc' } });
  }

  async findOne(id: string): Promise<Garment> {
    const garment = await this.prisma.garment.findUnique({ where: { id } });
    if (!garment) {
      throw new NotFoundException(`Garment ${id} not found`);
    }
    return garment;
  }
}
