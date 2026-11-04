import { Injectable } from "@nestjs/common";
import { InjectDataSource } from "@nestjs/typeorm";
import { DataSource, QueryFailedError } from "typeorm";
import { BikeSellEntity } from "../customers/entities/bike-sell.entity";
import { BikeEntity } from "./entities/bike.entity";
import type {
  BikeModel,
  BikesPageModel,
  CreateBikeModel,
  UpdateBikeModel,
} from "./models/bike.model";
import { BikeHasSalesError } from "./models/persistence-error.model";

// The repository is the only place that talks to the database (TypeORM).
// It returns business models, never entities.
@Injectable()
export class BikesRepository {
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {}

  // Pagination is done by the database (LIMIT / OFFSET), not in memory.
  // findAndCount returns the page AND the total number of rows in one call.
  async findAll(page: number, limit: number): Promise<BikesPageModel> {
    const [entities, totalCount] = await this.dataSource
      .getRepository(BikeEntity)
      .findAndCount({
        // A stable order (id as last criterion) is required, otherwise a bike
        // could appear on two pages or on none
        order: { brand: "ASC", model: "ASC", id: "ASC" },
        skip: (page - 1) * limit, // number of rows to skip
        take: limit,
      });
    return {
      totalCount,
      bikes: entities.map((entity) => this.toBikeModel(entity)),
    };
  }

  // Returns null when the bike does not exist (the service throws the 404)
  async findById(id: string): Promise<BikeModel | null> {
    const entity = await this.dataSource
      .getRepository(BikeEntity)
      .findOneBy({ id });
    return entity ? this.toBikeModel(entity) : null;
  }

  async create(input: CreateBikeModel): Promise<BikeModel> {
    const repository = this.dataSource.getRepository(BikeEntity);
    // create() builds the entity, save() inserts it and fills the generated id
    return this.toBikeModel(await repository.save(repository.create(input)));
  }

  // Returns null when the bike does not exist.
  // A transaction makes the read + write atomic.
  async update(id: string, input: UpdateBikeModel): Promise<BikeModel | null> {
    return this.dataSource.transaction(async (manager) => {
      const repository = manager.getRepository(BikeEntity);
      const entity = await repository.findOneBy({ id });
      if (!entity) return null;
      // merge() copies only the defined properties (undefined are ignored)
      repository.merge(entity, input);
      return this.toBikeModel(await repository.save(entity));
    });
  }

  // Returns false when the bike does not exist.
  // Throws BikeHasSalesError when the bike is linked to at least one sale.
  async delete(id: string): Promise<boolean> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const repository = manager.getRepository(BikeEntity);
        if (!(await repository.existsBy({ id }))) return false;
        // Explicit check so we can answer 409 instead of a database error:
        // the sales history must be kept
        if (await manager.getRepository(BikeSellEntity).existsBy({ bikeId: id }))
          throw new BikeHasSalesError();
        await repository.delete(id);
        return true;
      });
    } catch (error) {
      this.translateError(error);
    }
  }

  // Converts database errors into business errors (no ORM type leaves the repository)
  private translateError(error: unknown): never {
    // Safety net: BikeSellEntity uses onDelete "RESTRICT", so the database
    // itself refuses to delete a bike that was sold (e.g. a sale created
    // between our check and the delete)
    if (
      error instanceof QueryFailedError &&
      error.message.includes("FOREIGN KEY constraint failed")
    ) {
      throw new BikeHasSalesError();
    }
    throw error;
  }

  // Entity (database) -> business model
  private toBikeModel(entity: BikeEntity): BikeModel {
    return {
      id: entity.id,
      brand: entity.brand,
      model: entity.model,
      description: entity.description,
      category: entity.category,
      frameMaterial: entity.frameMaterial,
      frameSizeCm: entity.frameSizeCm,
      wheelSizeInches: entity.wheelSizeInches,
      gearCount: entity.gearCount,
      weightKg: entity.weightKg,
      electric: entity.electric,
      priceCents: entity.priceCents,
    };
  }
}