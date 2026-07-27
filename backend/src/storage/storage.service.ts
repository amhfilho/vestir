export interface StoredFile {
  path: string;
}

/**
 * Abstract class used as the Nest DI token (a plain `interface` disappears at
 * compile time and can't be injected). Swap the bound implementation per
 * environment — e.g. R2StorageService in Phase 1.1 — without touching callers.
 */
export abstract class StorageService {
  abstract save(buffer: Buffer, originalName: string): Promise<StoredFile>;
}
