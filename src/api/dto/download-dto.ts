import { IsString } from 'class-validator';

export class DownloadDto {
  @IsString()
  id: string;

  @IsString()
  secret: string;
}
