export interface GarmentAnalysis {
  type: string;
  colors: string[];
  style: string;
  occasions: string[];
  pattern: string;
  estimatedMaterial: string;
  /** Natural-language summary of the fields above; this is what gets embedded. */
  description: string;
}

/**
 * Abstract class used as the Nest DI token. `MockVisionAnalysisService` binds
 * here for now; Phase 1.1 swaps in a `ClaudeVisionAnalysisService` that calls
 * the real Claude vision API, with no changes needed at the call sites.
 */
export abstract class VisionAnalysisService {
  abstract analyze(imageBuffer: Buffer): Promise<GarmentAnalysis>;
}
