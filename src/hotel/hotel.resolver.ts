import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { HotelService } from "./hotel.service";
import { Hotel } from "./entities/hotel.entity";
import { CreateHotelInput } from "./dto/create-hotel.input";
import { UpdateHotelInput } from "./dto/update-hotel.input";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { RoomType } from "./entities/room-type.entity";
import { RoomTypeService } from "./room-type/room-type.service";

@Resolver(() => Hotel)
export class HotelResolver {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomTypeService: RoomTypeService
  ) {}

  @Mutation(() => Hotel, { description: "Create a new hotel" })
  async createHotel(
    @Args("createHotelInput") createHotelInput: CreateHotelInput
  ) {
    return this.hotelService.create(createHotelInput);
  }

  @Query(() => [Hotel], { description: "Get all the hotels in the database." })
  async findAllHotels() {
    return this.hotelService.findAll();
  }

  @Query(() => Hotel, { nullable: true, description: "Find a hotel by its ID" })
  async findOneHotel(
    @Args("id", { type: () => String }, ParseObjectIdPipe) id: Types.ObjectId
  ) {
    return this.hotelService.findOne(id);
  }

  @ResolveField("roomTypes", () => [RoomType], {
    description: "Finds the types of rooms available in a hotel.",
  })
  async getRoomTypes(@Parent() hotel: Hotel) {
    return this.roomTypeService.findByIds(hotel.room_type_ids);
  }

  @Mutation(() => Hotel, {
    description: "Find a hotel by its ID, and update its data.",
  })
  async updateOneHotel(
    @Args("id", { type: () => String }, ParseObjectIdPipe) id: Types.ObjectId,
    @Args("updateHotelInput") updateHotelInput: UpdateHotelInput
  ) {
    return this.hotelService.update(id, updateHotelInput);
  }

  @Mutation(() => Hotel, { description: "Delete a hotel with its data" })
  async removeOneHotel(
    @Args("id", { type: () => String }, ParseObjectIdPipe) id: Types.ObjectId
  ) {
    return this.hotelService.remove(id);
  }
}
