import { IsString, IsEmail, IsEnum, IsOptional } from 'class-validator';

export class CreateOtpDto {
  @IsString()
  otp_token: string;

  @IsEmail({}, { message: 'Invalid email format' })
  otp_email: string;

  @IsOptional()
  @IsEnum(['pending', 'active', 'block'], { message: 'Invalid status' })
  otp_status?: string;
}