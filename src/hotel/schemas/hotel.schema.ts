import { ObjectType, Field, ID, Int, Float } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Accommodation, City, Facility, PolicyRule, Tag } from "../enums";
import { HOTEL_CONFIG } from "../config";

@ObjectType({ description: "Data for a hotel" })
@Schema({ timestamps: true })
export class Hotel {
  @Field(() => ID, {
    description: "Unique identifier for a hotel",
  })
  _id: Types.ObjectId;

  @Field({ description: "Name of the hotel" })
  @Prop({ required: true, match: /^[A-Za-z0-9\s\-\.,'&]+$/, maxlength: 255 })
  name: string;

  @Prop({ required: true })
  @Field({ description: "Description of the hotel" })
  description: string;

  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: "RoomType" }] })
  @Field(() => [ID], {
    description: "Available types of rooms in a hotel.",
  })
  roomTypeIds: Types.ObjectId[];

  @Field(() => ID, {
    description: "Reference to the location object of the hotel.",
  })
  @Prop({ required: true, type: Types.ObjectId, ref: "Location" })
  locationId: Types.ObjectId;

  @Field(() => String, { nullable: true })
  @Prop({ required: true, type: String, enum: Object.values(City) }) // only used to filter hotels by city
  city: City;

  @Field(() => Int, {
    nullable: true,
    description: "Rating of the hotel. 0-5 stars",
  })
  @Prop({ default: 0, min: 0, max: 5 })
  stars?: number;

  @Field(() => Float, {
    nullable: true,
    description: "Average user review score. 0-10",
  })
  @Prop({
    default: 0,
    min: HOTEL_CONFIG.MIN_REVIEW_SCORE,
    max: HOTEL_CONFIG.MAX_REVIEW_SCORE,
  })
  reviewScore?: number;

  @Field(() => [ID], {
    description: "Media references (images/ videos) for a hotel.",
  })
  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: "Media" }] })
  mediaIds: Types.ObjectId[];

  @Field(() => [String], {
    nullable: true,
    description:
      "Generic labels that highlights key features of a hotel. Example: Family Friendly, Budget Friendly.",
  })
  @Prop({ type: [String], enum: Object.values(Tag) })
  tags?: Tag[];

  @Field(() => [String], {
    nullable: true,
    description:
      "Facilities offered by the hotel. Example: 24hr Check in, Pool Access, etc.",
  })
  @Prop({ type: [String], enum: Object.values(Facility) })
  facilities?: Facility[];

  @Field(() => [String], {
    nullable: true,
    description:
      "Specifies the rule the hotel conforms to. Example: No check out after 12 pm.",
  })
  @Prop({ type: [String], enum: Object.values(PolicyRule) })
  policies?: PolicyRule[];

  @Field(() => String, {
    description: "Type of accommodation. Example: Hotel, Resort, etc.",
  })
  @Prop({ type: String, required: true, enum: Object.values(Accommodation) })
  accommodationType: Accommodation;
}

export type HotelDocument = HydratedDocument<Hotel>;
export const HotelSchema = SchemaFactory.createForClass(Hotel);
