import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RoomType } from "../schemas/room-type.schema";
import { Model, Types } from "mongoose";
import { RoomTypeFilters } from "../types";

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectModel(RoomType.name) private readonly roomTypeModel: Model<RoomType>
  ) {}

  async findByIds(roomTypeIds: Types.ObjectId[]): Promise<RoomType[]> {
    return this.roomTypeModel.find({ _id: { $in: roomTypeIds } });
  }

  async filter(
    input: RoomTypeFilters,
    roomTypeIds?: Types.ObjectId[]
  ): Promise<RoomType[]> {
    if (!roomTypeIds?.length) return []; // earlier steps returned no results

    const { adults, amenities, children, minPrice, maxPrice } = input;

    const filterQuery: {
      _id?: { $in: Types.ObjectId[] };
      pricePerNight?: { $lte: number; $gte: number };
      maxAdults: { $gte: number };
      complementaryChild?: { $gte: number };
      amenities?: { $all: string[] };
    } = {
      maxAdults: { $gte: adults },
    };

    if (roomTypeIds?.length) {
      filterQuery._id = { $in: roomTypeIds };
    }

    if (typeof minPrice === "number" && typeof maxPrice === "number") {
      filterQuery.pricePerNight = { $lte: maxPrice, $gte: minPrice };
    }

    if (typeof children === "number") {
      filterQuery.complementaryChild = { $gte: children };
    }

    if (amenities?.length) {
      filterQuery.amenities = { $all: amenities };
    }

    return await this.roomTypeModel.find(filterQuery);
  }
}
