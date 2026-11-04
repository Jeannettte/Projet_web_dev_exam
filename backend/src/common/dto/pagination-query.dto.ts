import { Transform } from "class-transformer";
import { IsInt, Max, Min } from "class-validator";

// Pagination rules from the exam statement: page >= 1 (default 1),
// 1 <= limit <= 50 (default 10).
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 50;

// Query params always arrive as strings ("2"). We convert only strings made of
// digits. Anything else ("abc", "1.5", "-1", "") is left untouched, so @IsInt()
// rejects it and Nest answers 400.
const toStrictInteger = ({ value }: { value: unknown }): unknown =>
  typeof value === "string" &&
  /^\d+$/.test(value) &&
  Number(value) <= Number.MAX_SAFE_INTEGER
    ? Number(value)
    : value;

// Shared by every paginated endpoint (customers, bikes) to avoid duplicating
// the validation rules.
export class PaginationQueryDto {
  // The default value is used when the param is missing from the URL
  @Transform(toStrictInteger)
  @IsInt()
  @Min(1)
  page: number = DEFAULT_PAGE;

  @Transform(toStrictInteger)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT) // limit > 50 => 400
  limit: number = DEFAULT_LIMIT;
}