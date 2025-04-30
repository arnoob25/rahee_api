import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@ObjectType({
  description: "Review left by a user. Example: User review for a hotel.",
})
@Schema({ timestamps: true })
export class Review {
  @Field(() => ID, { description: "Unique identifier for the review" })
  _id: Types.ObjectId;

  @Field(() => Int, { description: "Rating given by the reviewer, like 10/10" })
  @Prop({ required: true, min: 0, max: 10 })
  rating: number;

  @Field({ description: "Full content of the review" })
  @Prop({ required: true, maxlength: 1000 })
  content: string;

  @Field(() => ID, { description: "User id of the reviewer" })
  @Prop({ required: true, type: Types.ObjectId, ref: "User" })
  authorId: Types.ObjectId;

  @Field(() => ID, {
    description: "Identifier for the hotel the user reviewed",
  })
  @Prop({ required: true, type: Types.ObjectId, ref: "Hotel" })
  hotelId: Types.ObjectId;

  @Field(() => Date, { description: "Time when the review was created" })
  createdAt: Date;
}

export type ReviewDocument = HydratedDocument<Review>;
export const ReviewSchema = SchemaFactory.createForClass(Review);
