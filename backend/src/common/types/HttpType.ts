import { IsNumber, IsOptional, IsString } from "class-validator";

export class HttpResponseDTO {
    @IsOptional()
    data?: any;
  
    @IsOptional()
    @IsNumber()
    status_code?: number;
  
    @IsOptional()
    @IsString()
    message?: string;
  }

export class ServiceResponseDTO { 
    @IsOptional()
    successful?: boolean;

    data?: any;

    @IsOptional()
    message?: string | undefined
}