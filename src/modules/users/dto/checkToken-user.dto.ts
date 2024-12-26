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

export class CheckTokenUserDto {
  @ApiProperty()
  @IsNotEmpty({message: "token ko dc bo trong"})
  @IsString()
  token: string

  @ApiProperty()
  @IsNotEmpty({ message: 'name ko dc de trong' })
  @IsString()
  name: string;

  @IsOptional()
  password: string;

  @IsOptional()
  email: string;

  @ApiProperty()
  @Type(() => Date)
  @IsNotEmpty({ message: 'date birth not empty' })
  @IsDate()
  date_of_birth: Date;

  @IsOptional()
  status: string
}
