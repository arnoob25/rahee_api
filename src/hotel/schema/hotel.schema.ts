import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@ObjectType({ description: "Data for a hotel" })
@Schema()
export class Hotel {
  @Field(() => ID, {
    nullable: false,
    description: "Unique identifier for a hotel",
  })
  _id: Types.ObjectId;

  @Field({ nullable: false, description: "Name of the hotel" })
  @Prop({ required: true, match: /^[A-Za-z0-9\s\-\.,'&]+$/, maxlength: 255 })
  name: string;

  @Prop({ required: true })
  @Field({ nullable: false, description: "Description of the hotel" })
  description: string;

  @Prop({ required: true, type: Array<Types.ObjectId>, ref: "RoomType" })
  @Field(() => [ID], {
    nullable: false,
    description: "Available types of rooms in a hotel.",
  })
  room_type_ids: Types.ObjectId[];

  @Prop({ required: true, maxlength: 800 })
  @Field({ nullable: false, description: "Address of the hotel" })
  address: string;

  @Field(() => Float, {
    description: "Rating of the hotel. 0-5 stars",
  })
  @Prop({ default: 0, min: 0, max: 5 })
  star_rating?: number;

  @Field(() => Float, {
    description: "Average user review score. 0-10",
  })
  @Prop({ required: false, default: 0, min: 0, max: 10 })
  review_score?: number;
}

export type HotelDocument = HydratedDocument<Hotel>;
export const HotelSchema = SchemaFactory.createForClass(Hotel);
