import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@ObjectType({ description: "Registered user of our service." })
@Schema({ timestamps: true })
export class User {
  @Field(() => ID, { description: "Unique identifier for the user" })
  _id: Types.ObjectId;

  @Field({ description: "Username of the user" })
  @Prop({ required: true, unique: true, minlength: 3, maxlength: 50 })
  username: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);
