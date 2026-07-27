import { Injectable } from '@nestjs/common';
import { EMBEDDING_DIMENSIONS, EmbeddingsService } from './embeddings.service';

function hashString(text: string): number {
  let hash = 5381;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash * 33) ^ text.charCodeAt(i);
  }
  return hash >>> 0;
}

/** mulberry32 — small, seedable PRNG; good enough for deterministic mock data. */
function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Stands in for a real embedding-provider call during development. The
 * vector is seeded from the input text, so the same description always
 * embeds to the same vector.
 */
@Injectable()
export class MockEmbeddingsService extends EmbeddingsService {
  async embed(text: string): Promise<number[]> {
    const random = mulberry32(hashString(text));
    const vector = Array.from(
      { length: EMBEDDING_DIMENSIONS },
      () => random() * 2 - 1,
    );
    return Promise.resolve(vector);
  }
}
