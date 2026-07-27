import { Module } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';
import { MockEmbeddingsService } from './mock-embeddings.service';

@Module({
  providers: [{ provide: EmbeddingsService, useClass: MockEmbeddingsService }],
  exports: [EmbeddingsService],
})
export class EmbeddingsModule {}
