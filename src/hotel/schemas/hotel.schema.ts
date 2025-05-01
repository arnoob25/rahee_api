import { ObjectType, Field, ID, Float } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Facility, PolicyRule, Tag } from "../enums";

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

  @Prop({ required: true, maxlength: 800 })
  @Field({ description: "Address of the hotel" })
  address: string;

  @Field(() => Float, {
    nullable: true,
    description: "Rating of the hotel. 0-5 stars",
  })
  @Prop({ default: 0, min: 0, max: 5 })
  starRating?: number;

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
}

export type HotelDocument = HydratedDocument<Hotel>;
export const HotelSchema = SchemaFactory.createForClass(Hotel);
