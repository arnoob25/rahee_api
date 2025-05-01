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

@Resolver(() => Hotel)
export class HotelResolver {
  constructor(
    private readonly hotelService: HotelService,
    private readonly roomTypeService: RoomTypeService,
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
    return this.roomTypeService.findByIds(hotel.roomTypeIds);
  }

  @ResolveField("media", () => [Media], {
    description: "Finds the related images and videos for a hotel.",
  })
  async getMedia(@Parent() hotel: Hotel) {
    return this.commonService.findMediaByIds(hotel.mediaIds);
  }

  // TODO: need to implement pagination
  @ResolveField("reviews", () => [Review], {
    description: "Finds all the user reviews for a hotel",
  })
  async getReviews(@Parent() hotel: Hotel) {
    return this.commonService.findReviewsByHotelId(hotel._id);
  }

  @ResolveField("reviewScore", () => Number, {
    description: "Average user review score. 0-10",
  })
  async getReviewScore(@Parent() hotel: Hotel) {
    const reviews = await this.commonService.findReviewsByHotelId(hotel._id);
    if (reviews.length === 0) return 0;

    const totalScore = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageScore = Math.round(totalScore / reviews.length);

    console.log(reviews, averageScore);

    return averageScore;
  }

  @ResolveField("reviewCount", () => Number, {
    description: "Number of reviews received by the hotel.",
  })
  async getReviewCount(@Parent() hotel: Hotel) {
    return (await this.commonService.findReviewsByHotelId(hotel._id)).length;
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
