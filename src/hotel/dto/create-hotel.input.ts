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
    message: "Please provide a hotel name between 1 and 100 characters.",
  })
  name: string;

  @Field({
    nullable: false,
    description:
      "Description of the hotel. Example: 'A cozy hotel with a beach view, perfect for families.'",
  })
  @IsString()
  @Length(1, 500, {
    message: "Please provide a description between 1 and 500 characters.",
  })
  description: string;

  @Field(() => [ID], {
    nullable: false,
    description: "Available types of rooms in a hotel.",
  })
  @IsArray()
  @IsMongoId({ each: true, message: "Each room type ID must be a valid ID." })
  roomTypeIds: [Types.ObjectId];

  @Field({
    nullable: false,
    description:
      "Address of the hotel. Example: '123 Ocean Ave, Beach City, USA'",
  })
  @IsString()
  @Length(1, 200, {
    message: "Please provide an address between 1 and 200 characters.",
  })
  address: string;

  @Field(() => Float, {
    nullable: true,
    description: "Rating of the hotel. 0-5 stars. Example: 4.5",
  })
  @IsOptional()
  @IsInt()
  @IsNumber()
  @Min(0, { message: "Rating cannot be less than 0." })
  @Max(5, { message: "Rating cannot be more than 5." })
  stars?: number;
}
