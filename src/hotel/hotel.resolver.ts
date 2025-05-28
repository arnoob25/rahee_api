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
import { getUniqueObjectIds } from "src/common/utils/mongo.util";
import { SORT_ORDER } from "src/common/enums";

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
    description: "Filter and sort hotels from the database.",
  })
  async filterHotels(@Args("filters") filters: FilterHotelsInput) {
    // narrow down scope by filtering out hotels with primary attributes
    const initialHotels = await this.hotelService.filter(
      getHotelFilters(filters)
    );

    if (!initialHotels.length) return [];

    // find room types in these hotels that satisfy respective filters - to narrow down scope
    let narrowedDownRoomTypeIds = getUniqueObjectIds(
      initialHotels.map((hotel) => hotel.roomTypeIds).flat()
    );

    const filteredRoomTypes = await this.roomTypeService.filter(
      getRoomTypeFilters(filters),
      narrowedDownRoomTypeIds
    );

    if (!filteredRoomTypes) return [];

    narrowedDownRoomTypeIds = filteredRoomTypes.map((roomType) => roomType._id);

    // check if these room types have rooms available - further narrow down the scope
    const availableRooms = await this.roomService.findAvailable(
      getRoomFilters(filters),
      narrowedDownRoomTypeIds
    );

    if (!availableRooms) return [];

    const availableRoomTypeIds = new Set(
      availableRooms.map((room) => room.roomTypeId.toString())
    );

    // these hotel themselves along with their room types with available rooms also satisfy the filters
    // if applied, these hotels are sorted by popularity (guest rating)
    const finalHotels = initialHotels.filter((hotel) =>
      hotel.roomTypeIds.some((id) => availableRoomTypeIds.has(id.toString()))
    );

    // optionally, sort by price
    if (filters.priceSort) {
      const roomTypeMap = new Map(
        filteredRoomTypes.map((rt) => [rt._id.toString(), rt])
      );

      // Map each hotel ID to its minimum available room price
      const hotelToMinPrice = new Map<string, number>();

      for (const hotel of finalHotels) {
        const prices = hotel.roomTypeIds
          .map((id) => roomTypeMap.get(id.toString()))
          .filter(
            (rt): rt is (typeof filteredRoomTypes)[number] =>
              !!rt && availableRoomTypeIds.has(rt._id.toString())
          )
          .map((rt) => rt.pricePerNight);

        if (prices.length) {
          hotelToMinPrice.set(hotel._id.toString(), Math.min(...prices));
        }
      }

      finalHotels.sort((a, b) => {
        const aPrice = hotelToMinPrice.get(a._id.toString()) ?? Infinity;
        const bPrice = hotelToMinPrice.get(b._id.toString()) ?? Infinity;

        return filters.priceSort === SORT_ORDER.ASC
          ? aPrice - bPrice
          : bPrice - aPrice;
      });
    }

    return finalHotels;
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
    nullable: true,
    description: "Price of the room with the lowest rate in the hotel.",
  })
  async getStartingPrice(@Parent() hotel: Hotel) {
    const roomTypes = await this.roomTypeService.findByIds(hotel.roomTypeIds);
    if (roomTypes.length === 0) return null;
    const prices = roomTypes.map((rt) => rt.pricePerNight);
    return Math.min(...prices);
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
