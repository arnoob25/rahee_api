import { InputType, Field, Float, ID } from "@nestjs/graphql";
import { Types } from "mongoose";

@InputType()
export class CreateHotelInput {
  @Field({
    nullable: false,
    description: "Name of the hotel. Example: 'Porco's Hotel'",
  })
  name: string;

  @Field({
    nullable: false,
    description:
      "Description of the hotel. Example: 'A cozy hotel with a beach view, perfect for families.'",
  })
  description: string;

  @Field(() => [ID], {
    nullable: false,
    description: "Available types of rooms in a hotel.",
  })
  room_types: [Types.ObjectId];

  @Field({
    nullable: false,
    description:
      "Address of the hotel. Example: '123 Ocean Ave, Beach City, USA'",
  })
  address: string;

  @Field(() => Float, {
    description: "Rating of the hotel. 0-5 stars. Example: 4.5",
  })
  star_rating?: number;

  @Field(() => Float, {
    description: "Average user review score. 0-10. Example: 8.7",
  })
  review_score?: number;
}
