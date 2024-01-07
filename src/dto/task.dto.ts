import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString, IsOptional, MinLength } from 'class-validator';

export class TaskDto {
  @ApiProperty({ example: 'Task Title', description: 'The title of the task' })
  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  readonly title: string;

  @ApiProperty({ example: 'John Doe', description: 'The author of the task' })
  @IsNotEmpty()
  @IsString()
  readonly author: string;

  @ApiProperty({ example: 'Task Description', description: 'The description of the task', required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ example: true, description: 'Indicates whether the task is completed', required: false })
  @IsOptional()
  @IsBoolean()
  readonly isCompleted?: boolean;

  @ApiProperty({ example: true, description: 'Indicates whether the task is synced with Google Calendar', required: false })
  @IsOptional()
  @IsBoolean()
  readonly isSyncedWithGoogleCalendar?: boolean;

  @ApiProperty({ example: new Date(), description: 'The start date of the task', required: false ,default: Date.now()})
  @IsNotEmpty()
  readonly startDate: Date;

  @ApiProperty({ example: new Date(), description: 'The end date of the task', required: true })
  @IsNotEmpty()
  readonly endDate: Date;
}

export class UpdateTaskDto {
  @ApiProperty({ example: 'Updated Task Title', description: 'The updated title of the task', required: false })
  @IsOptional()
  @IsString()
  @MinLength(1)
  readonly title?: string;

  @ApiProperty({ example: 'Updated Author', description: 'The updated author of the task', required: false })
  @IsOptional()
  @IsString()
  @MinLength(2)
  readonly author?: string;

  @ApiProperty({ example: 'Updated Task Description', description: 'The updated description of the task', required: false })
  @IsOptional()
  @IsString()
  readonly description?: string;

  @ApiProperty({ example: true, description: 'Indicates whether the task is completed', required: false })
  @IsOptional()
  @IsBoolean()
  readonly isCompleted?: boolean;

  @ApiProperty({ example: true, description: 'Indicates whether the task is synced with Google Calendar', required: false })
  @IsOptional()
  @IsBoolean()
  readonly isSyncedWithGoogleCalendar?: boolean;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z', description: 'The updated start date of the task', required: false })
  @IsOptional()
  readonly startDate?: Date;

  @ApiProperty({ example: '2022-01-01T00:00:00.000Z', description: 'The updated end date of the task', required: false })
  @IsOptional()
  readonly endDate?: Date;
}
