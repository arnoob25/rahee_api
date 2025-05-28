import { Field, ID, InputType, Int, Float } from "@nestjs/graphql";
import {
  IsArray,
  IsInt,
  IsMongoId,
  IsOptional,
  Min,
  Max,
  IsEnum,
  IsDateString,
  IsNumber,
} from "class-validator";
import { Types } from "mongoose";
import { HOTEL_CONFIG, ROOM_TYPE_CONFIG } from "../config";
import { Accommodation, Amenity, City, Facility, Tag } from "../enums";
import { Expose } from "class-transformer";
import { SORT_ORDER } from "src/common/enums";

@InputType()
export class FilterHotelsInput {
  @Expose()
  @Field(() => String, {
    nullable: true,
    description: "Type of accommodation. Example: Hotel, Resort, etc.",
  })
  @IsOptional()
  @IsEnum(Accommodation, {
    message:
      "Accommodation type must be one of the allowed Accommodation enum values.",
  })
  type?: string;

  @Expose()
  @Field(() => String, {
    nullable: true,
    description:
      "City to filer the hotels by (Must exist in the City enum). Example: Dhaka, Sylhet.",
  })
  @IsOptional()
  @IsEnum(City, {
    message: "Each city must be one of the allowed City enum values.",
  })
  city?: string;

  @Expose()
  @Field(() => ID, {
    nullable: true,
    description: "The unique identifier used to filter by property address.",
  })
  @IsOptional()
  @IsMongoId({ message: "locationId must be a valid MongoDB ObjectId" })
  locationId?: Types.ObjectId;

  @Expose()
  @Field(() => Float, {
    description: "Minimum average review score. Must be between 0 and 10.",
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(HOTEL_CONFIG.MIN_REVIEW_SCORE)
  @Max(HOTEL_CONFIG.MAX_REVIEW_SCORE)
  minRating?: number;

  @Expose()
  @Field(() => Int, {
    description: "Hotel star rating. Must be between 1 and 5.",
    nullable: true,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  stars?: number;

  @Expose()
  @Field(() => [String], {
    description:
      "Generic labels that highlights key features of a hotel (Must exist in the Tag enum). Example: Budget Friendly.",
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Tag, {
    each: true,
    message: "Each tag must be one of the allowed Tag enum values.",
  })
  tags?: string[];

  @Expose()
  @Field(() => [String], {
    description:
      "Facilities offered by the hotel (Must exist in the Facility enum). Example: 24hr Check in, Pool Access, etc.",
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Facility, {
    each: true,
    message: "Each facility must be one of the allowed Facility enum values.",
  })
  facilities?: string[];

  @Expose()
  @Field(() => Float, {
    description: "Minimum price per night (in the relevant currency).",
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(ROOM_TYPE_CONFIG.MIN_PRICE_PER_NIGHT)
  @Max(ROOM_TYPE_CONFIG.MAX_PRICE_PER_NIGHT)
  minPrice?: number;

  // TODO max price has to be more than min price
  @Expose()
  @Field(() => Float, {
    description: "Maximum price per night (in the relevant currency).",
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  @Min(ROOM_TYPE_CONFIG.MIN_PRICE_PER_NIGHT)
  @Max(ROOM_TYPE_CONFIG.MAX_PRICE_PER_NIGHT)
  maxPrice?: number;

  @Expose()
  @Field(() => Int, {
    description: "Number of adult guests. Must be at least 1.",
  })
  @IsInt()
  @Min(ROOM_TYPE_CONFIG.MIN_ALLOWED_ADULTS, {
    message: `There must be at least ${
      ROOM_TYPE_CONFIG.MIN_ALLOWED_ADULTS
    } adult${ROOM_TYPE_CONFIG.MIN_ALLOWED_ADULTS > 1 ? "s" : ""}.`,
  })
  @Max(ROOM_TYPE_CONFIG.MAX_ALLOWED_ADULTS, {
    message: `There can be at most ${ROOM_TYPE_CONFIG.MAX_ALLOWED_ADULTS} adults.`,
  })
  adults: number;

  @Expose()
  @Field(() => Int, {
    nullable: true,
    description: "Number of child guests. Must be 0 or more.",
    defaultValue: 0,
  })
  @IsInt()
  @Min(ROOM_TYPE_CONFIG.MIN_ALLOWED_CHILD)
  @Max(ROOM_TYPE_CONFIG.MAX_ALLOWED_CHILD, {
    message: `There can be at most ${ROOM_TYPE_CONFIG.MAX_ALLOWED_CHILD} children.`,
  })
  @IsOptional()
  children?: number;

  @Expose()
  @Field(() => [String], {
    description:
      "Perks that come with the room (Must exist in the Amenity enum). Example: Free wifi, Room service, etc.",
    nullable: true,
  })
  @IsOptional()
  @IsArray()
  @IsEnum(Amenity, {
    each: true,
    message: "Each amenity must be one of the allowed Amenity enum values.",
  })
  amenities?: string[];

  @Expose()
  @Field({
    description: "Check-in date in ISO 8601 format (YYYY-MM-DD).",
  })
  @IsDateString({}, { message: "checkInDate must be a valid ISO date string." })
  checkInDate: string;

  // TODO check out date greater than check in date
  @Expose()
  @Field({
    description: "Check-out date in ISO 8601 format (YYYY-MM-DD).",
  })
  @IsDateString(
    {},
    { message: "checkOutDate must be a valid ISO date string." }
  )
  checkOutDate: string;

  @Expose()
  @Field({
    nullable: true,
    description: "Sort by price (Lowest to highest, or highest to lowest).",
  })
  @IsOptional()
  @IsEnum(SORT_ORDER, {
    message:
      "Sorting order should be either 'asc' (ascending) or 'dsc' descending.",
  })
  priceSort?: SORT_ORDER;

  @Expose()
  @Field({
    nullable: true,
    description:
      "Sort by popularity (average aggregated guest rating). Most popular (highest avg. rating) to least popular and vice versa.",
  })
  @IsOptional()
  @IsEnum(SORT_ORDER, {
    message:
      "Sorting order should be either 'asc' (ascending) or 'dsc' descending",
  })
  popularitySort?: SORT_ORDER;
}
