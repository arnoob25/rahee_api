import {
  Field,
  ID,
  ObjectType,
  Int,
  Float,
  registerEnumType,
} from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export enum BedType {
  single = "single",
  double = "double",
}

registerEnumType(BedType, {
  name: "BedType",
  description:
    "Describes the type of bed for a room type. Example: Single bed, double bed, etc.",
});

@ObjectType({
  description:
    "Represents a type of room in a hotel, including details about pricing, bed type, and maximum capacity. Example: Deluxe, Standard, etc.",
})
@Schema()
export class RoomType {
  @Field(() => ID, { description: "Unique identifier for the room type." })
  _id: Types.ObjectId;

  @Field({
    description:
      "The name or designation of the room type (e.g., Deluxe, Standard).",
  })
  @Prop({ required: true, maxlength: 255 })
  name: string;

  @Field(() => BedType, {
    nullable: false,
    description: "Type of the bed in this room (e.g., King, Single).",
  })
  @Prop({ required: true, type: String, enum: Object.values(BedType) })
  bed_type?: BedType;

  @Field(() => Float, {
    nullable: false,
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
    description:
      "The number of complementary children that can stay in this room type, if any.",
  })
  @Prop({ default: 0, min: 0, max: 20 })
  complementary_child?: number;
}

export type RoomTypeDocument = HydratedDocument<RoomType>;
export const RoomTypeSchema = SchemaFactory.createForClass(RoomType);
