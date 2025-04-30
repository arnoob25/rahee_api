import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { MediaType } from "src/hotel/enums";

@ObjectType({
  description:
    "A media asset, such as an image or video, associated with content.",
})
@Schema({ timestamps: true })
export class Media {
  @Field(() => ID, { description: "Unique identifier for the media item." })
  _id: Types.ObjectId;

  @Prop({ required: true, type: String, enum: Object.values(MediaType) })
  @Field(() => MediaType, {
    description: "The type of media, either image or video.",
  })
  type: MediaType;

  @Prop({ required: true })
  @Field({ description: "The URL where the media file is hosted." })
  url: string;

  @Prop({ default: false })
  @Field({
    nullable: true,
    defaultValue: false,
    description: "Marks this media as the cover image.",
  })
  isCover?: boolean;

  @Prop({ default: false })
  @Field({
    nullable: true,
    defaultValue: false,
    description: "Marks this media as featured content.",
  })
  isFeatured?: boolean;
}

export type MediaDocument = HydratedDocument<Media>;
export const MediaSchema = SchemaFactory.createForClass(Media);
