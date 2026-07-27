import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { StorageService } from './storage.service';
import { LocalDiskStorageService } from './local-disk-storage.service';

@Module({
  providers: [
    {
      provide: StorageService,
      useFactory: (config: ConfigService) =>
        new LocalDiskStorageService(
          config.get<string>('STORAGE_LOCAL_PATH', 'storage/garments'),
        ),
      inject: [ConfigService],
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
