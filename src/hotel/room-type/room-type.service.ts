import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RoomType } from "../schemas/room-type.schema";
import { Model, Types } from "mongoose";
import { RoomTypeFilters } from "../types";
import { SORT_ORDER } from "src/common/enums";

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
    roomTypeIds: Types.ObjectId[]
  ): Promise<RoomType[]> {
    if (!roomTypeIds?.length) return []; // earlier steps returned no results

    const { adults, amenities, children, minPrice, maxPrice, priceSort } =
      input;

    const filterQuery: {
      complementaryChild?: { $gte: number };
      amenities?: { $all: string[] };
    } = {};

    if (typeof children === "number") {
      filterQuery.complementaryChild = { $gte: children };
    }

    if (amenities?.length) {
      filterQuery.amenities = { $all: amenities };
    }

    const query = this.roomTypeModel.find({
      _id: { $in: roomTypeIds },
      pricePerNight: { $lte: maxPrice, $gte: minPrice },
      maxAdults: { $gte: adults },
      ...filterQuery,
    });

    if (priceSort) {
      query.sort({ pricePerNight: priceSort === SORT_ORDER.ASC ? 1 : -1 });
    }

    return await query.exec();
  }
}
