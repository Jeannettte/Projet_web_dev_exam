import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
} from "@nestjs/common";
import { CustomersService } from "./customers.service";
import {
  BikeSellResponseDto,
  PurchasedBikeSellResponseDto,
} from "./dto/bike-sell-response.dto";
import { CreateBikeSellDto } from "./dto/create-bike-sell.dto";
import { CreateCustomerDto } from "./dto/create-customer.dto";
import { CustomerResponseDto, CustomersPageResponseDto } from "./dto/customer-response.dto";
import { UpdateCustomerDto } from "./dto/update-customer.dto";
import type {
  CreateCustomerModel,
  UpdateCustomerModel,
} from "./models/customer.model";
import {Transform } from "class-transformer";
import { IsInt, IsOptional, Min } from "class-validator";

//compliance with instructions 
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;


const toStrictInteger = ({value}:{value: unknown}) : unknown =>
  typeof value ==="string" && /^\d+$/.test(value) &&
  Number(value) <= Number.MAX_SAFE_INTEGER
    ? Number(value)
    : value;

    // DTO for query parameters of the list customers endpoint
    // @IsInt () and @Min(1) decorators ensure that the page and limit values are valid integers greater than or equal to 1

class ListCustomersQueryDto {  
  @Transform(toStrictInteger)
  @IsInt()
  @Min(1)
  page:number = DEFAULT_PAGE;

  @Transform(toStrictInteger)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number = DEFAULT_LIMIT;
}
export class CustomersController {
  constructor(
    @Inject(CustomersService) private readonly service: CustomersService,
  ) {}

  // Endpoint to retrieve a paginated list of customers
  // The @Query() decorator is used to extract the query parameters from the request and map them to the ListCustomersQueryDto class
  @Get()
  async findAll( @Query() query: ListCustomersQueryDto): Promise<CustomersPageResponseDto> {
    return CustomersPageResponseDto.fromModel(
      await this.service.findAll(query.page, query.limit),
    );
  }

  @Post()
  async create(@Body() dto: CreateCustomerDto): Promise<CustomerResponseDto> {
    const input: CreateCustomerModel = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate,
      address: dto.address,
      postalCode: dto.postalCode,
      city: dto.city,
      country: dto.country,
    };
    return CustomerResponseDto.fromModel(await this.service.create(input));
  }

  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<CustomerResponseDto> {
    return CustomerResponseDto.fromModel(await this.service.findById(id));
  }

  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ): Promise<CustomerResponseDto> {
    const input: UpdateCustomerModel = {
      firstName: dto.firstName,
      lastName: dto.lastName,
      email: dto.email,
      phone: dto.phone,
      birthDate: dto.birthDate,
      address: dto.address,
      postalCode: dto.postalCode,
      city: dto.city,
      country: dto.country,
    };
    return CustomerResponseDto.fromModel(await this.service.update(id, input));
  }

  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id);
  }

  @Get(":id/bikes")
  async findPurchases(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<PurchasedBikeSellResponseDto[]> {
    return (await this.service.findPurchases(id)).map((model) =>
      PurchasedBikeSellResponseDto.fromModel(model),
    );
  }

  @Post(":id/bikes")
  async createSale(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: CreateBikeSellDto,
  ): Promise<BikeSellResponseDto> {
    return BikeSellResponseDto.fromModel(
      await this.service.createSale(id, {
        bikeId: dto.bikeId,
        quantity: dto.quantity,
      }),
    );
  }
}
