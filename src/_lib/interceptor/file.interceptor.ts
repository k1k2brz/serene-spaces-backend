import { BadRequestException } from '@nestjs/common';

// 파일 필터링 함수
export const imageFileFilter = (req, file, callback) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return callback(
      new BadRequestException(
        '지원하지 않는 파일 형식입니다. (jpg, jpeg, png만 허용)',
      ),
      false,
    );
  }
  callback(null, true);
};
