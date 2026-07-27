import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import * as path from 'path';
import { Injectable } from '@nestjs/common';
import { StorageService, StoredFile } from './storage.service';

@Injectable()
export class LocalDiskStorageService extends StorageService {
  constructor(private readonly basePath: string) {
    super();
  }

  async save(buffer: Buffer, originalName: string): Promise<StoredFile> {
    await fs.mkdir(this.basePath, { recursive: true });

    const extension = path.extname(originalName);
    const safeBase = path
      .basename(originalName, extension)
      .replace(/[^a-zA-Z0-9-_]/g, '_');
    const filename = `${randomUUID()}-${safeBase}${extension}`;

    await fs.writeFile(path.join(this.basePath, filename), buffer);

    return { path: filename };
  }
}
