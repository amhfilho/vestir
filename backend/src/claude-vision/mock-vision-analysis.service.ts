import { Injectable } from '@nestjs/common';
import {
  GarmentAnalysis,
  VisionAnalysisService,
} from './vision-analysis.service';

type Fixture = Omit<GarmentAnalysis, 'description'>;

const FIXTURES: Fixture[] = [
  {
    type: 'T-Shirt',
    colors: ['white'],
    style: 'casual',
    occasions: ['everyday', 'weekend'],
    pattern: 'solid',
    estimatedMaterial: 'cotton',
  },
  {
    type: 'Jeans',
    colors: ['blue'],
    style: 'casual',
    occasions: ['everyday', 'weekend'],
    pattern: 'solid',
    estimatedMaterial: 'denim',
  },
  {
    type: 'Blazer',
    colors: ['navy'],
    style: 'formal',
    occasions: ['work', 'business'],
    pattern: 'solid',
    estimatedMaterial: 'wool',
  },
  {
    type: 'Dress',
    colors: ['red'],
    style: 'elegant',
    occasions: ['party', 'evening'],
    pattern: 'floral',
    estimatedMaterial: 'silk',
  },
  {
    type: 'Sneakers',
    colors: ['white', 'black'],
    style: 'sporty',
    occasions: ['everyday', 'gym'],
    pattern: 'solid',
    estimatedMaterial: 'synthetic leather',
  },
];

function describeFixture(fixture: Fixture): string {
  return (
    `A ${fixture.colors.join('/')} ${fixture.pattern} ${fixture.type}, ${fixture.style} style, ` +
    `suitable for ${fixture.occasions.join(', ')}. Estimated material: ${fixture.estimatedMaterial}.`
  );
}

/**
 * Stands in for the real Claude vision call during development. Picks a
 * fixture deterministically from the image bytes, so the same upload always
 * "analyzes" the same way.
 */
@Injectable()
export class MockVisionAnalysisService extends VisionAnalysisService {
  async analyze(imageBuffer: Buffer): Promise<GarmentAnalysis> {
    const index = this.hashToIndex(imageBuffer, FIXTURES.length);
    const fixture = FIXTURES[index];
    return Promise.resolve({
      ...fixture,
      description: describeFixture(fixture),
    });
  }

  private hashToIndex(buffer: Buffer, modulus: number): number {
    const sum = buffer.reduce((total, byte) => total + byte, 0);
    return sum % modulus;
  }
}
