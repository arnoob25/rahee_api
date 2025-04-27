import { Module } from "@nestjs/common";
import { HotelService } from "./hotel.service";
import { HotelResolver } from "./hotel.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Hotel, HotelSchema } from "./entities/hotel.entity";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Hotel.name, schema: HotelSchema }]),
  ],
  providers: [HotelResolver, HotelService],
})
export class HotelModule {}
