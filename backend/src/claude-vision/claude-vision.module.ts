import { Module } from '@nestjs/common';
import { VisionAnalysisService } from './vision-analysis.service';
import { MockVisionAnalysisService } from './mock-vision-analysis.service';

@Module({
  providers: [
    { provide: VisionAnalysisService, useClass: MockVisionAnalysisService },
  ],
  exports: [VisionAnalysisService],
})
export class ClaudeVisionModule {}
