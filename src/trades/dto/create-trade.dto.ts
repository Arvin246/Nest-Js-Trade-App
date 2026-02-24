import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateTradeDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;

  @IsString()
  @MinLength(1, { message: 'Device name must not be empty' })
  deviceName: string;

  @IsNumber()
  @Min(0, { message: 'Amount paid must be 0 or greater' })
  amountPaid: number;
}
