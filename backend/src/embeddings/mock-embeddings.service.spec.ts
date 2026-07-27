import { EMBEDDING_DIMENSIONS } from './embeddings.service';
import { MockEmbeddingsService } from './mock-embeddings.service';

describe('MockEmbeddingsService', () => {
  let service: MockEmbeddingsService;

  beforeEach(() => {
    service = new MockEmbeddingsService();
  });

  it(`returns a ${EMBEDDING_DIMENSIONS}-dimensional vector of numbers`, async () => {
    const vector = await service.embed('a blue cotton t-shirt');

    expect(vector).toHaveLength(EMBEDDING_DIMENSIONS);
    vector.forEach((value) => expect(typeof value).toBe('number'));
  });

  it('is deterministic for the same text', async () => {
    const first = await service.embed('a blue cotton t-shirt');
    const second = await service.embed('a blue cotton t-shirt');

    expect(second).toEqual(first);
  });

  it('produces a different vector for different text', async () => {
    const first = await service.embed('a blue cotton t-shirt');
    const second = await service.embed('a red silk evening dress');

    expect(second).not.toEqual(first);
  });
});
