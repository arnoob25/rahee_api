import { Field, ID, ObjectType, Int, Float } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { Amenity, BedType, RoomCategory } from "../enums";

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

  @Field(() => RoomCategory, {
    description:
      "Category of rooms in a hotel. Each category holds several room types. Example: Suite category may hold room types: Family Suite, Penthouse Suite.",
  })
  @Prop({ required: true, type: String, enum: Object.values(RoomCategory) })
  room_category: RoomCategory;

  @Field(() => BedType, {
    description: "Type of the bed in this room (e.g., King, Single).",
  })
  @Prop({ required: true, type: String, enum: Object.values(BedType) })
  bed_type: BedType;

  @Field(() => Float, {
    description: "The price per night for this room type.",
  })
  @Prop({ required: true, min: 0, max: 9999999 })
  price_per_night: number;

  @Field(() => Int, {
    description: "The maximum number of adults that can occupy this room type.",
  })
  @Prop({ required: true, min: 1, max: 20 })
  max_adults: number;

  @Field(() => Int, {
    nullable: true,
    description:
      "The number of complementary children that can stay in this room type, if any.",
  })
  @Prop({ default: 0, min: 0, max: 20 })
  complementary_child?: number;

  @Field(() => [ID], {
    description: "Media references (images/ videos) for a type of room.",
  })
  @Prop({ required: true, type: [{ type: Types.ObjectId, ref: "Media" }] })
  media_ids: Types.ObjectId[];

  @Field(() => [Amenity], {
    nullable: true,
    description:
      "Perks that come with the room. Example: Free wifi, Room service, etc.",
  })
  @Prop({ type: [String], enum: Object.values(Amenity) })
  amenities: Amenity[];
}

export type RoomTypeDocument = HydratedDocument<RoomType>;
export const RoomTypeSchema = SchemaFactory.createForClass(RoomType);
