import {
  IsBoolean,
  IsNotEmpty,
  IsString,
  IsOptional,
  MinLength,
} from 'class-validator';

export class TaskDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly title: string;

  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsBoolean()
  readonly isCompleted?: boolean;

}
export class UpdateTaskDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly title?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly author?: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsBoolean()
  readonly isCompleted?: boolean;
}