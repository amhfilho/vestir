import {
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Garment } from '../generated/prisma/client';
import { WardrobeService } from './wardrobe.service';

const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

@Controller('wardrobe')
export class WardrobeController {
  constructor(private readonly wardrobe: WardrobeService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  create(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new FileTypeValidator({
            fileType: /^image\//,
            fallbackToMimetype: true,
          }),
          new MaxFileSizeValidator({ maxSize: MAX_UPLOAD_BYTES }),
        ],
      }),
    )
    file: Express.Multer.File,
  ): Promise<Garment> {
    return this.wardrobe.createFromUpload(file);
  }

  @Get()
  findAll(): Promise<Garment[]> {
    return this.wardrobe.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Garment> {
    return this.wardrobe.findOne(id);
  }
}
