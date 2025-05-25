import { Field, ID, ObjectType } from "@nestjs/graphql";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

@ObjectType({
    description: "Represents a reservation made for a specific room in a hotel, including check-in and check-out dates.",
})
@Schema({ timestamps: true })
export class Reservation {
    @Field(() => ID, { description: "Unique identifier for the reservation." })
    _id: Types.ObjectId;

    @Field(() => ID, { description: "ID of the room that is reserved." })
    @Prop({ required: true, type: Types.ObjectId, ref: "Room" })
    roomId: Types.ObjectId;

    @Field({ description: "The check-in date and time for the reservation." })
    @Prop({ required: true, type: Date })
    checkInAt: Date;

    @Field({ description: "The check-out date and time for the reservation." })
    @Prop({ required: true, type: Date })
    checkOutAt: Date;

    @Field({
        description: "Indicates whether the reservation has been completed.",
    })
    @Prop({ default: false })
    isCompleted: boolean;
}

export type ReservationDocument = HydratedDocument<Reservation>;
export const ReservationSchema = SchemaFactory.createForClass(Reservation);
