import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RoomType } from "../entities/room-type.entity";
import { Model, Types } from "mongoose";

@Injectable()
export class RoomTypeService {
  constructor(
    @InjectModel(RoomType.name) private readonly roomTypeModel: Model<RoomType>
  ) {}

  async findByIds(ids: Types.ObjectId[]): Promise<RoomType[]> {
    return this.roomTypeModel.find({ _id: { $in: ids } });
  }
}
