/**
 * Matches OpenAI's `text-embedding-3-small` output size — chosen so the
 * pgvector column doesn't need to change when the mock is replaced with a
 * real embedding provider.
 */
export const EMBEDDING_DIMENSIONS = 1536;

/**
 * Abstract class used as the Nest DI token. `MockEmbeddingsService` binds
 * here for now; Phase 1.1 swaps in a real OpenAI/Claude embeddings call with
 * no changes needed at the call sites.
 */
export abstract class EmbeddingsService {
  abstract embed(text: string): Promise<number[]>;
}
