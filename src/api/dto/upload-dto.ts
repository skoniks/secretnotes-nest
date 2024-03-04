import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsString, Max, Min } from 'class-validator';

export class UploadDto {
  @IsString()
  secret: string;

  @IsInt()
  @Min(300)
  @Max(259200)
  @Type(() => Number)
  expire: number;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  compact: boolean;
}
