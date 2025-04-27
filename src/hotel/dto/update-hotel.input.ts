import { CreateHotelInput } from "./create-hotel.input";
import { InputType, PartialType } from "@nestjs/graphql";

@InputType()
export class UpdateHotelInput extends PartialType(CreateHotelInput) {}
