import { promises as fs } from 'fs';
import * as os from 'os';
import * as path from 'path';
import { LocalDiskStorageService } from './local-disk-storage.service';

describe('LocalDiskStorageService', () => {
  let basePath: string;
  let service: LocalDiskStorageService;

  beforeEach(async () => {
    basePath = await fs.mkdtemp(path.join(os.tmpdir(), 'vestir-storage-'));
    service = new LocalDiskStorageService(basePath);
  });

  afterEach(async () => {
    await fs.rm(basePath, { recursive: true, force: true });
  });

  it('writes the buffer to disk and returns the file path it was stored under', async () => {
    const buffer = Buffer.from('fake-image-bytes');

    const result = await service.save(buffer, 'shirt.jpg');

    expect(result.path).toMatch(/\.jpg$/);
    const written = await fs.readFile(path.join(basePath, result.path));
    expect(written.equals(buffer)).toBe(true);
  });

  it('returns a distinct path for repeated uploads of the same original name', async () => {
    const buffer = Buffer.from('same-bytes');

    const first = await service.save(buffer, 'shirt.jpg');
    const second = await service.save(buffer, 'shirt.jpg');

    expect(first.path).not.toBe(second.path);
  });

  it('creates the base directory when it does not exist yet', async () => {
    const nestedBasePath = path.join(basePath, 'nested', 'dir');
    const nestedService = new LocalDiskStorageService(nestedBasePath);

    const result = await nestedService.save(Buffer.from('pants'), 'pants.png');

    const written = await fs.readFile(path.join(nestedBasePath, result.path));
    expect(written.length).toBeGreaterThan(0);
  });

  it('strips unsafe characters from the original filename', async () => {
    const result = await service.save(
      Buffer.from('x'),
      '../../weird name?.jpg',
    );

    expect(result.path).not.toContain('/');
    expect(result.path).not.toContain('?');
  });
});
