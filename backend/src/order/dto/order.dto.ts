import {
  IsArray,
  IsEmail,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class TicketDto {
  @IsString() film: string;
  @IsString() session: string;
  @IsString() daytime: string;
  @IsNumber() row: number;
  @IsNumber() seat: number;
  @IsNumber() price: number;
}

export class CreateOrderDto {
  @IsEmail() email: string;
  @IsString() phone: string;
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TicketDto)
  tickets: TicketDto[];
}

export class TicketResponseDto extends TicketDto {
  id: string;
}
