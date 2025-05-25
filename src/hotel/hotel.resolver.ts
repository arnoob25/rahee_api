import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from "@nestjs/graphql";
import { HotelService } from "./hotel.service";
import { Hotel } from "./schemas/hotel.schema";
import { CreateHotelInput } from "./dto/create-hotel.input";
import { UpdateHotelInput } from "./dto/update-hotel.input";
import { ParseObjectIdPipe } from "@nestjs/mongoose";
import { Types } from "mongoose";
import { RoomType } from "./schemas/room-type.schema";
import { RoomTypeService } from "./room-type/room-type.service";
import { Media } from "src/common/schemas/media.schema";
import { CommonService } from "src/common/common.service";
import { Review } from "src/common/schemas/review.schema";
import { RoomService } from "./room/room.service";
import { FilterHotelsInput } from "./dto/filter-hotels.input";
import { ParseDatePipe } from "@nestjs/common";
import { getHotelFilters, getRoomFilters, getRoomTypeFilters } from "./types";
import { Location } from "src/common/schemas/location.schema";

@Resolver(() => Hotel)
export class HotelResolver {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomTypeService: RoomTypeService,
    private readonly roomService: RoomService,
    private readonly commonService: CommonService
  ) {}

  @Mutation(() => Hotel, { description: "Create a new hotel" })
  async createHotel(
    @Args("createHotelInput") createHotelInput: CreateHotelInput
  ) {
    return this.hotelService.create(createHotelInput);
  }

  @Query(() => [Hotel], { description: "Get all the hotels in the database." })
  async findHotels() {
    return this.hotelService.find();
  }

  @Query(() => [Hotel], {
    description: "Get all the hotels in the database.",
  })
  async filterHotels(@Args("filters") filters: FilterHotelsInput) {
    const initialHotels = await this.hotelService.filter(
      getHotelFilters(filters)
    ); // narrow down scope by filtering out obvious hotels

    if (!initialHotels.length) return [];

    // further narrow down rooms we need to check
    const roomTypesToCheck = Array.from(
      new Set(initialHotels.map((hotel) => hotel.roomTypeIds).flat())
    ); // ensure uniqueness

    const initialRoomTypes = await this.roomTypeService.filter(
      getRoomTypeFilters(filters),
      roomTypesToCheck
    );

    if (!initialRoomTypes) return [];

    // search for available rooms within narrowed down context
    const narrowedDownRoomTypes = initialRoomTypes.map(
      (roomType) => roomType._id
    );

    const availableRooms = await this.roomService.findAvailable(
      getRoomFilters(filters),
      narrowedDownRoomTypes
    );

    const availableRoomTypeIds = new Set(
      availableRooms.map((room) => room.roomTypeId.toString())
    ); // get unique room types

    return initialHotels.filter((hotel) =>
      hotel.roomTypeIds.some((id) => availableRoomTypeIds.has(id.toString()))
    );
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
    return this.roomTypeService.findByIds(hotel.roomTypeIds);
  }

  @ResolveField("media", () => [Media], {
    description: "Finds the related images and videos for a hotel.",
  })
  async getMedia(@Parent() hotel: Hotel) {
    return this.commonService.findMediaByIds(hotel.mediaIds);
  }

  @ResolveField("location", () => Location, {
    nullable: true,
    description: "Location data for the hotel. Area, city, co-ordinates, etc.",
  })
  async getLocation(@Parent() hotel: Hotel) {
    return this.commonService.findLocationById(hotel.locationId);
  }

  @ResolveField("reviews", () => [Review], {
    description: "Finds all the user reviews for a hotel",
  })
  async getReviews(@Parent() hotel: Hotel) {
    return this.commonService.findReviewsByHotelId(hotel._id);
  }

  @ResolveField("reviewCount", () => Number, {
    description: "Number of reviews received by the hotel.",
  })
  async countReviews(@Parent() hotel: Hotel) {
    return (await this.commonService.findReviewsByHotelId(hotel._id)).length;
  }

  @ResolveField("startingPrice", () => Number, {
    description: "Price of the room with the lowest rate in the hotel.",
  })
  async getStartingPrice(@Parent() hotel: Hotel) {
    const roomTypes = await this.roomTypeService.findByIds(hotel.roomTypeIds);
    return Math.min(...roomTypes.map((rt) => rt.pricePerNight));
  }

  @ResolveField("availableRoomCount", () => Number, {
    description: "Number of available rooms in the hotel.",
  })
  async countAvailableRooms(
    @Parent() hotel: Hotel,
    @Args("checkInDate", { type: () => String }, new ParseDatePipe())
    checkInDate: Date,
    @Args("checkOutDate", { type: () => String }, new ParseDatePipe())
    checkOutDate: Date
  ) {
    const roomTypes = await this.roomTypeService.findByIds(hotel.roomTypeIds);
    const roomTypeIdsToCheck = roomTypes.map((roomType) => roomType._id); // narrow down context
    if (!roomTypeIdsToCheck) return 0;

    const availableRooms = this.roomService.findAvailable(
      { checkInDate, checkOutDate },
      roomTypeIdsToCheck
    );

    return (await availableRooms).length;
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
