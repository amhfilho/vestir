import { MockVisionAnalysisService } from './mock-vision-analysis.service';

describe('MockVisionAnalysisService', () => {
  let service: MockVisionAnalysisService;

  beforeEach(() => {
    service = new MockVisionAnalysisService();
  });

  it('returns a structurally valid garment analysis', async () => {
    const result = await service.analyze(Buffer.from('some-image-bytes'));

    expect(result.type.length).toBeGreaterThan(0);
    expect(result.colors.length).toBeGreaterThan(0);
    expect(result.style.length).toBeGreaterThan(0);
    expect(result.occasions.length).toBeGreaterThan(0);
    expect(result.pattern.length).toBeGreaterThan(0);
    expect(result.estimatedMaterial.length).toBeGreaterThan(0);
    expect(result.description).toContain(result.type);
    expect(result.description).toContain(result.estimatedMaterial);
  });

  it('is deterministic for the same image bytes', async () => {
    const buffer = Buffer.from('identical-bytes');

    const first = await service.analyze(buffer);
    const second = await service.analyze(buffer);

    expect(second).toEqual(first);
  });

  it('can return different analyses for different images', async () => {
    const results = await Promise.all(
      ['a', 'b', 'c', 'd', 'e', 'f', 'g'].map((seed) =>
        service.analyze(Buffer.from(seed)),
      ),
    );

    const distinctTypes = new Set(results.map((r) => r.type));
    expect(distinctTypes.size).toBeGreaterThan(1);
  });
});
