import { ApiProperty } from '@nestjs/swagger';

export class UploadLogoDto {
  @ApiProperty({
    description: '로고 이미지 파일',
  })
  logoUrl: string;
}
