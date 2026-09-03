import { IsNumber, IsOptional } from "class-validator";
import { ObjectLiteral, Repository } from "typeorm";

export interface IPagination<T extends ObjectLiteral = any> {
  page?: number;
  limit?: number;
  baseQuery: string;
  countQuery: string;
  params: any[];
}

export interface IPaginator {
  data: any[];
  total: number;
  currentPage: number;
  perPage: number;
}

export class LoadPagesDto {
  @IsNumber({}, { message: "Page number is required" })
  page_number!: number;

  @IsNumber({}, { message: "Limit is required" })
  limit!: number;

  @IsOptional()
  metadata?:any
}