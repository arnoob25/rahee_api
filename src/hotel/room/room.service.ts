import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Room } from "../schemas/room.schema";
import { Model, Types } from "mongoose";
import { Reservation } from "../schemas/reservation.schema";
import { RoomFilters } from "../types";

@Injectable()
export class RoomService {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<Room>,
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>
  ) {}

  async findByIds(ids: Types.ObjectId[]): Promise<Room[]> {
    return this.roomModel.find({ _id: { $in: ids } });
  }

  async findByRoomType(roomTypeId: Types.ObjectId): Promise<Room[]> {
    return this.roomModel.find({ roomTypeId: { $eq: roomTypeId } });
  }

  async findAvailable(
    input: RoomFilters,
    roomTypeIds?: Types.ObjectId[]
  ): Promise<Room[]> {
    if (!roomTypeIds?.length) return []; // earlier steps returned no results

    const {
      checkInDate: desiredCheckInDate,
      checkOutDate: desiredCheckOutDate,
    } = input;

    const filterQuery: { roomId?: { $in: Types.ObjectId[] } } = {};

    // optionally narrow down scope
    if (roomTypeIds?.length) {
      const narrowedDownRooms = this.roomModel.find({
        roomTypeId: { $in: roomTypeIds },
      });

      const roomIds = (await narrowedDownRooms).map((roomId) => roomId._id);

      if (roomIds?.length) filterQuery.roomId = { $in: roomIds };
    }

    const reservations = await this.reservationModel.find({
      isCompleted: false,
      $or: [
        { checkInAt: { $gte: new Date(desiredCheckOutDate) } },
        { checkOutAt: { $lte: new Date(desiredCheckInDate) } },
      ],
      ...filterQuery,
    });

    const availableRoomIds = reservations
      .map((reservation) => reservation.roomId)
      .filter((roomId) => roomId !== null);

    const uniqueRoomIds = Array.from(new Set(availableRoomIds)); // prevent getting the same room twice

    return this.findByIds(uniqueRoomIds);
  }
}
