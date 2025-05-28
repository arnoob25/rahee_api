import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateHotelInput } from "./dto/create-hotel.input";
import { UpdateHotelInput } from "./dto/update-hotel.input";
import { InjectModel } from "@nestjs/mongoose";
import { Hotel } from "./schemas/hotel.schema";
import { Model, Types } from "mongoose";
import { HotelFilters } from "./types";
import { SORT_ORDER } from "src/common/enums";

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private readonly hotelModel: Model<Hotel>
  ) {}

  async create(createHotelInput: CreateHotelInput): Promise<Hotel> {
    return this.hotelModel.create(createHotelInput);
  }

  async find(): Promise<Hotel[]> {
    return this.hotelModel.find();
  }

  async filter(input: HotelFilters): Promise<Hotel[]> {
    const filterQuery: {
      type?: string;
      city?: string;
      locationId?: Types.ObjectId;
      reviewScore?: { $gte: number };
      stars?: number;
      tags?: { $all: string[] };
      facilities?: { $all: string[] };
      roomTypeIds?: { $in: Types.ObjectId[] };
    } = {};

    const {
      type,
      city,
      locationId,
      facilities,
      minRating,
      stars,
      tags,
      popularitySort,
    } = input;

    if (type) {
      filterQuery.type = type;
    }

    if (city) {
      filterQuery.city = city;
    }

    if (locationId) {
      filterQuery.locationId = locationId;
    }

    if (minRating) {
      filterQuery.reviewScore = { $gte: minRating };
    }

    if (stars) {
      filterQuery.stars = stars;
    }

    if (tags && tags.length > 0) {
      filterQuery.tags = { $all: tags };
    }

    if (facilities && facilities.length > 0) {
      filterQuery.facilities = { $all: facilities };
    }

    const query = this.hotelModel.find(filterQuery);

    if (popularitySort) {
      query.sort({ reviewScore: popularitySort === SORT_ORDER.ASC ? 1 : -1 });
    }

    return await query.exec();
  }

  async findOne(id: Types.ObjectId): Promise<Hotel> {
    const hotel = await this.hotelModel.findById(id);

    if (!hotel) {
      throw new NotFoundException(`Hotel with the id ${String(id)} not found`);
    }

    return hotel;
  }

  async update(
    id: Types.ObjectId,
    updateHotelInput: UpdateHotelInput
  ): Promise<Hotel | null> {
    return this.hotelModel.findByIdAndUpdate(id, updateHotelInput);
  }

  async remove(id: Types.ObjectId): Promise<Hotel> {
    const deletedHotel = await this.hotelModel.findByIdAndDelete(id);

    if (!deletedHotel) {
      throw new NotFoundException(`Hotel with the id ${String(id)} not found.`);
    }

    return deletedHotel;
  }
}
