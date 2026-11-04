import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
  ValidateIf,
} from "class-validator";
import { trimString } from "./transforms";

// Same pattern as UpdateCustomerDto: a field that is absent (undefined) is not
// validated, a field that is present must respect the same rules as at creation.
const isDefined = (_object: unknown, value: unknown): boolean =>
  value !== undefined;

// Validates the body of PATCH /bikes/:id (partial update)
export class UpdateBikeDto {
  @ValidateIf(isDefined)
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  brand?: string;

  @ValidateIf(isDefined)
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  model?: string;

  @ValidateIf(isDefined)
  @Transform(trimString)
  @IsString()
  description?: string;

  @ValidateIf(isDefined)
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  category?: string;

  @ValidateIf(isDefined)
  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  frameMaterial?: string;

  @ValidateIf(isDefined)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  frameSizeCm?: number;

  @ValidateIf(isDefined)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  wheelSizeInches?: number;

  @ValidateIf(isDefined)
  @IsInt()
  @Min(1)
  gearCount?: number;

  @ValidateIf(isDefined)
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  weightKg?: number;

  @ValidateIf(isDefined)
  @IsBoolean()
  electric?: boolean;

  @ValidateIf(isDefined)
  @IsInt()
  @Min(0)
  priceCents?: number;
}