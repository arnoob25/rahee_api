import { Module } from "@nestjs/common";
import { HotelService } from "./hotel.service";
import { HotelResolver } from "./hotel.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Hotel, HotelSchema } from "./entities/hotel.entity";
import { RoomType, RoomTypeSchema } from "./entities/room-type.entity";
import { Room, RoomSchema } from "./entities/room.entity";
import { RoomTypeService } from './room-type/room-type.service';
import { RoomService } from './room/room.service';
import { RoomTypeResolver } from './room-type/room-type.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
    MongooseModule.forFeature([
      { name: RoomType.name, schema: RoomTypeSchema },
    ]),
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  providers: [HotelResolver, HotelService, RoomTypeService, RoomService, RoomTypeResolver],
})
export class HotelModule {}
