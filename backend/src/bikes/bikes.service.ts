import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BikesRepository } from "./bikes.repository";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";
import { BikeHasSalesError } from "./models/persistence-error.model";

// The service holds the business rules and chooses the HTTP errors
// (404, 409, 400). It does not know TypeORM.
@Injectable()
export class BikesService {
  constructor(
    @Inject(BikesRepository) private readonly repository: BikesRepository,
  ) {}

  // The service just passes the pagination parameters on
  findAll(page: number, limit: number): Promise<BikesPageModel> {
    return this.repository.findAll(page, limit);
  }

  // Missing bike => 404
  async findById(id: string): Promise<BikeModel> {
    const bike = await this.repository.findById(id);
    if (!bike) throw new NotFoundException("Bike not found");
    return bike;
  }

  create(input: CreateBikeModel): Promise<BikeModel> {
    return this.repository.create(input);
  }

  async update(id: string, input: UpdateBikeModel): Promise<BikeModel> {
    // An empty PATCH body makes no sense => 400 (same rule as customers)
    if (!Object.values(input).some((value) => value !== undefined))
      throw new BadRequestException("At least one field must be supplied");
    const bike = await this.repository.update(id, input);
    if (!bike) throw new NotFoundException("Bike not found"); // 404
    return bike;
  }

  async delete(id: string): Promise<void> {
    try {
      // The repository returns false when nothing was found => 404
      if (!(await this.repository.delete(id)))
        throw new NotFoundException("Bike not found");
    } catch (error) {
      this.translateError(error);
    }
  }

  // Business error => HTTP error. Other errors (including the 404 thrown
  // above) are rethrown unchanged.
  private translateError(error: unknown): never {
    if (error instanceof BikeHasSalesError)
      throw new ConflictException("Bike is linked to existing sales"); // 409
    throw error;
  }
}