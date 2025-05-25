import { Field, ID, ObjectType, Int, Float } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Amenity, BedType, RoomCategory } from "../enums";
import { ROOM_TYPE_CONFIG } from "../config";

@ObjectType({
  description:
    "Represents a type of room in a hotel, including details about pricing, bed type, and maximum capacity. Example: Deluxe, Standard, etc.",
})
@Schema({ timestamps: true })
export class RoomType {
  @Field(() => ID, { description: "Unique identifier for the room type." })
  _id: Types.ObjectId;

  @Field({
    description:
      "The name or designation of the room type (e.g., Deluxe, Standard).",
  })
  @Prop({ required: true, maxlength: 255 })
  name: string;

  @Field(() => String, {
    description:
      "Category of rooms in a hotel. Each category holds several room types. Example: Suite category may hold room types: Family Suite, Penthouse Suite.",
  })
  @Prop({ required: true, type: String, enum: Object.values(RoomCategory) })
  roomCategory: RoomCategory;

  @Field(() => String, {
    description: "Type of the bed in this room (e.g., King, Single).",
  })
  @Prop({ required: true, type: String, enum: Object.values(BedType) })
  bedType: BedType;

  @Field(() => Float, {
    description: "The price per night for this room type.",
  })
  @Prop({
    required: true,
    min: ROOM_TYPE_CONFIG.MIN_PRICE_PER_NIGHT,
    max: ROOM_TYPE_CONFIG.MAX_PRICE_PER_NIGHT,
  })
  pricePerNight: number;

  @Field(() => Int, {
    description: "The maximum number of adults that can occupy this room type.",
  })
  @Prop({
    required: true,
    min: ROOM_TYPE_CONFIG.MIN_ALLOWED_ADULTS,
    max: ROOM_TYPE_CONFIG.MAX_ALLOWED_ADULTS,
  })
  maxAdults: number;

  @Field(() => Int, {
    nullable: true,
    description:
      "The number of complementary children that can stay in this room type, if any.",
  })
  @Prop({
    default: 0,
    min: ROOM_TYPE_CONFIG.MIN_ALLOWED_CHILD,
    max: ROOM_TYPE_CONFIG.MAX_ALLOWED_CHILD,
  })
  complementaryChild?: number;

  @Field(() => [ID], {
    description: "Media references (images/ videos) for a type of room.",
  })
  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: "Media" }] })
  mediaIds: Types.ObjectId[];

  @Field(() => [String], {
    nullable: true,
    description:
      "Perks that come with the room. Example: Free wifi, Room service, etc.",
  })
  @Prop({ type: [String], enum: Object.values(Amenity) })
  amenities: Amenity[];
}

export type RoomTypeDocument = HydratedDocument<RoomType>;
export const RoomTypeSchema = SchemaFactory.createForClass(RoomType);
