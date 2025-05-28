import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";
import { City, Country, LocationType, State } from "src/hotel/enums";

// some properties (like label, address) are optional because types like country, city won't have them. Enforce rules during client input.

@ObjectType({
  description:
    "Represents a geographic location, including label, address, city, state, country, and geolocation data.",
})
@Schema({ timestamps: true })
export class Location {
  @Field(() => ID, { description: "Unique identifier for the location." })
  _id: Types.ObjectId;

  @Field(() => String, {
    nullable: true,
    description: "Type of the location. Example: Country, City, Property, etc.",
  })
  @Prop({ type: String, enum: Object.values(LocationType) })
  type?: LocationType;

  @Field({
    nullable: true,
    description:
      "Label or short name used to identify the location (e.g., 'Dhaka City Center').",
  })
  @Prop({ maxlength: 255 })
  label?: string;

  @Field({ nullable: true, description: "Street address of the location." })
  @Prop({ maxlength: 512 })
  address?: string;

  @Field(() => String, {
    nullable: true,
    description: "City where the location is situated.",
  })
  @Prop({ type: String, enum: Object.values(City) })
  city?: City[];

  @Field(() => String, {
    nullable: true,
    description: "State or administrative region of the location.",
  })
  @Prop({ type: String, enum: Object.values(State) })
  state?: State;

  @Field(() => String, { description: "Country of the location." })
  @Prop({ type: String, required: true, enum: Object.values(Country) })
  country: Country;

  @Field({ nullable: true, description: "ZIP or postal code, if applicable." })
  @Prop({
    maxlength: 20,
    match: /^[A-Za-z0-9\s]{3,20}$/,
  })
  zipCode?: string;

  @Field({
    nullable: true,
    description: "Latitude coordinate for geolocation-based features.",
  })
  @Prop({
    match: /^-?([1-8]?\d(\.\d+)?|90(\.0+)?)$/, // Latitude range -90 to +90
  })
  latitude?: number;

  @Field({
    nullable: true,
    description: "Longitude coordinate for geolocation-based features.",
  })
  @Prop({
    match: /^-?(180(\.0+)?|1[0-7]\d|[1-9]?\d)(\.\d+)?$/, // Longitude range -180 to +180
  })
  longitude?: number;
}

export type LocationDocument = HydratedDocument<Location>;
export const LocationSchema = SchemaFactory.createForClass(Location);
