import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { ClaudeVisionModule } from '../claude-vision/claude-vision.module';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { WardrobeController } from './wardrobe.controller';
import { WardrobeService } from './wardrobe.service';

@Module({
  imports: [StorageModule, ClaudeVisionModule, EmbeddingsModule],
  controllers: [WardrobeController],
  providers: [WardrobeService],
})
export class WardrobeModule {}
