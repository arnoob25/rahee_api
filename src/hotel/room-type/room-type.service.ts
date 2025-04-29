import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { RoomType } from "../schemas/room-type.schema";
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
