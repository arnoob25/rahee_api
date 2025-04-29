import { Field, ID, Int, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@ObjectType({
  description:
    "Represents a hotel room with its type, number, floor, and availability status.",
})
@Schema({ timestamps: true })
export class Room {
  @Field(() => ID, { description: "Unique identifier for the room." })
  _id: Types.ObjectId;

  @Prop({ required: true, type: Types.ObjectId, ref: "RoomType" })
  @Field(() => ID, {
    description: "Reference ID to the type of room (e.g., Deluxe, Suite).",
  })
  room_type_id: Types.ObjectId;

  @Prop({ required: true, min: 0, max: 999999 })
  @Field(() => Int, {
    description: "Specific number assigned to the room.",
  })
  room_number: number;

  @Prop({ required: true, min: 0, max: 999 })
  @Field(() => Int, {
    description: "The floor on which the room is located.",
  })
  floor_number: number;

  @Prop({ required: true })
  @Field({
    description: "Whether the room is currently available for booking.",
  })
  availability: boolean;
}

export type RoomDocument = HydratedDocument<Room>;
export const RoomSchema = SchemaFactory.createForClass(Room);
