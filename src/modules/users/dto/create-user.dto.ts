import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsEnum,
  IsDate,
  IsMongoId,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'name ko dc de trong' })
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  password: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'email is required' })
  @IsEmail({}, { message: 'Invalid email format' })
  @Matches(/^[\w-\.]+@(gmail\.com|tinasoft\.com\.vn)$/, {
    message: 'Email phải có đuôi là @gmail.com hoặc @tinasoft.com.vn',
  })
  email: string;

  @ApiProperty()
  @Type(() => Date)
  @IsNotEmpty({ message: 'date birth not empty' })
  @IsDate()
  date_of_birth: Date;


  @IsOptional()
  @IsEnum(['pending', 'active', 'block'], { message: 'Invalid status' })
  status: string;
}
