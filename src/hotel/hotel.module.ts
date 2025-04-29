import { Module } from "@nestjs/common";
import { HotelService } from "./hotel.service";
import { HotelResolver } from "./hotel.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Hotel, HotelSchema } from "./schemas/hotel.schema";
import { RoomType, RoomTypeSchema } from "./schemas/room-type.schema";
import { Room, RoomSchema } from "./schemas/room.schema";
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
