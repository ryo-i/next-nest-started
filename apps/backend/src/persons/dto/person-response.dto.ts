import { ApiProperty } from '@nestjs/swagger';

/**
 * Person 作成・取得 API のレスポンス型。
 */
export class PersonResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '織田信長' })
  name: string;
}
