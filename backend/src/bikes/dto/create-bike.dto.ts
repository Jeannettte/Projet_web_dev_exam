import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from "class-validator";
import { trimString } from "./transforms";

// Validates the body of POST /bikes. The constraints mirror the CHECK
// constraint of BikeEntity (price >= 0, every other number > 0).
// ValidationPipe is configured with whitelist + forbidNonWhitelisted, so
// unknown properties are rejected with a 400.
export class CreateBikeDto {
  @Transform(trimString)
  @IsString()
  @IsNotEmpty() // a string made only of spaces becomes "" after trim => rejected
  brand: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  model: string;

  // Required but may be empty
  @Transform(trimString)
  @IsString()
  description: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  category: string;

  @Transform(trimString)
  @IsString()
  @IsNotEmpty()
  frameMaterial: string;

  // NaN and Infinity are valid JS numbers but not valid sizes
  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive() // > 0
  frameSizeCm: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  wheelSizeInches: number;

  @IsInt() // a number of gears is a whole number
  @Min(1)
  gearCount: number;

  @IsNumber({ allowNaN: false, allowInfinity: false })
  @IsPositive()
  weightKg: number;

  @IsBoolean() // "true" (string) is rejected, only a real boolean is accepted
  electric: boolean;

  @IsInt() // cents: whole number, a free bike (0) is allowed
  @Min(0)
  priceCents: number;
}