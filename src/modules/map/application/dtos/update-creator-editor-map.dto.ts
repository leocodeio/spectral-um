import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { xCreatorEditorMapStatusType } from '../../../../../types';

export class UpdateCreatorEditorMapDto {
  @ApiProperty({
    description: 'Status of the mapping',
    required: false,
  })
  @IsOptional()
  status?: xCreatorEditorMapStatusType;
}
