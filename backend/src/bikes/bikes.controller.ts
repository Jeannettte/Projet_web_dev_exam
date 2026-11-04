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
import { PaginationQueryDto } from "../common/dto/pagination-query.dto";
import { BikesService } from "./bikes.service";
import { BikeResponseDto, BikesPageResponseDto } from "./dto/bike-response.dto";
import { CreateBikeDto } from "./dto/create-bike.dto";
import { UpdateBikeDto } from "./dto/update-bike.dto";
import type { CreateBikeModel, UpdateBikeModel } from "./models/bike.model";

// The controller only handles HTTP: it reads the request, calls the service
// and builds the response DTO. All routes start with /bikes.
@Controller("bikes")
export class BikesController {
  constructor(@Inject(BikesService) private readonly service: BikesService) {}

  // GET /bikes?page=1&limit=10
  // The global ValidationPipe validates the query using PaginationQueryDto
  @Get()
  async findAll(
    @Query() query: PaginationQueryDto,
  ): Promise<BikesPageResponseDto> {
    return BikesPageResponseDto.fromModel(
      await this.service.findAll(query.page, query.limit),
    );
  }

  // POST /bikes - the body is validated by CreateBikeDto (400 if invalid)
  @Post()
  async create(@Body() dto: CreateBikeDto): Promise<BikeResponseDto> {
    // DTO -> business model, listing the fields one by one (like customers)
    const input: CreateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.create(input));
  }

  // GET /bikes/:id - ParseUUIDPipe answers 400 if the id is not a valid UUID
  @Get(":id")
  async findById(
    @Param("id", ParseUUIDPipe) id: string,
  ): Promise<BikeResponseDto> {
    return BikeResponseDto.fromModel(await this.service.findById(id));
  }

  // PATCH /bikes/:id - partial update validated by UpdateBikeDto
  @Patch(":id")
  async update(
    @Param("id", ParseUUIDPipe) id: string,
    @Body() dto: UpdateBikeDto,
  ): Promise<BikeResponseDto> {
    const input: UpdateBikeModel = {
      brand: dto.brand,
      model: dto.model,
      description: dto.description,
      category: dto.category,
      frameMaterial: dto.frameMaterial,
      frameSizeCm: dto.frameSizeCm,
      wheelSizeInches: dto.wheelSizeInches,
      gearCount: dto.gearCount,
      weightKg: dto.weightKg,
      electric: dto.electric,
      priceCents: dto.priceCents,
    };
    return BikeResponseDto.fromModel(await this.service.update(id, input));
  }

  // DELETE /bikes/:id - 204 without body; 404 if unknown, 409 if already sold
  @Delete(":id")
  @HttpCode(204)
  async delete(@Param("id", ParseUUIDPipe) id: string): Promise<void> {
    await this.service.delete(id);
  }
}