import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Room } from "../schemas/room.schema";
import { Model, Types } from "mongoose";
import { Reservation } from "../schemas/reservation.schema";
import { RoomFilters } from "../types";
import { getUniqueObjectIds } from "src/common/utils/mongo.util";

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
    const {
      checkInDate: desiredCheckInDate,
      checkOutDate: desiredCheckOutDate,
    } = input;

    if (!roomTypeIds?.length) return []; // earlier steps returned no results

    // narrow down scope by selecting rooms in available room types
    const narrowedDownRooms = await this.roomModel.find({
      roomTypeId: { $in: roomTypeIds },
      isAvailable: true, // filter out out of service rooms
    });
    const narrowedDownRoomIds = narrowedDownRooms.map((roomId) => roomId._id);

    if (!narrowedDownRoomIds?.length) return [];

    // find reservations for these rooms that overlap with the query
    const overlappingReservations = await this.reservationModel.find({
      isCompleted: false,
      roomId: { $in: narrowedDownRoomIds },
      checkInAt: { $lt: new Date(desiredCheckOutDate) },
      checkOutAt: { $gt: new Date(desiredCheckInDate) },
    });

    let roomIdsWithOverlappingReservations: Types.ObjectId[] = [];

    if (overlappingReservations.length > 0) {
      roomIdsWithOverlappingReservations = getUniqueObjectIds(
        overlappingReservations.map((reservation) => reservation.roomId)
      );
    }

    // pick rooms without overlapping reservations
    const availableRooms = narrowedDownRooms.filter(
      (room) =>
        !roomIdsWithOverlappingReservations.some((id) => id.equals(room._id))
    );

    return availableRooms;
  }
}
