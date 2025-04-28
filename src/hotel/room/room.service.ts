import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Room } from "../entities/room.entity";
import { Model, Types } from "mongoose";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>
  ) {}

  async findByRoomType(roomTypeId: Types.ObjectId): Promise<Room[]> {
    return this.roomModel.find({ room_type_id: { $eq: roomTypeId } });
  }
}
