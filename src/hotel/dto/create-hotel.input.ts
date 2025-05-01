import { InputType, Field, Float, ID } from "@nestjs/graphql";
import { Types } from "mongoose";
import {
  IsString,
  Length,
  IsOptional,
  IsArray,
  IsMongoId,
  IsNumber,
  Min,
  Max,
  IsInt,
} from "class-validator";

@InputType()
export class CreateHotelInput {
  @Field({
    nullable: false,
    description: "Name of the hotel. Example: 'Porco's Hotel'",
  })
  @IsString()
  @Length(1, 100, {
    message: "Hotel name must be between 1 and 100 characters long.",
  })
  name: string;

  @Field({
    nullable: false,
    description:
      "Description of the hotel. Example: 'A cozy hotel with a beach view, perfect for families.'",
  })
  @IsString()
  @Length(1, 500, {
    message: "Description must be between 1 and 500 characters long.",
  })
  description: string;

  @Field(() => [ID], {
    nullable: false,
    description: "Available types of rooms in a hotel.",
  })
  @IsArray()
  @IsMongoId({ each: true })
  roomTypeIds: [Types.ObjectId];

  @Field({
    nullable: false,
    description:
      "Address of the hotel. Example: '123 Ocean Ave, Beach City, USA'",
  })
  @IsString()
  @Length(1, 200, {
    message: "Address must be between 1 and 200 characters long.",
  })
  address: string;

  @Field(() => Float, {
    nullable: true,
    description: "Rating of the hotel. 0-5 stars. Example: 4.5",
  })
  @IsOptional()
  @IsInt()
  @IsNumber()
  @Min(0)
  @Max(5)
  starRating?: number;
}
