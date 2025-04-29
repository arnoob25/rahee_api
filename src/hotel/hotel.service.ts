import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateHotelInput } from "./dto/create-hotel.input";
import { UpdateHotelInput } from "./dto/update-hotel.input";
import { InjectModel } from "@nestjs/mongoose";
import { Hotel } from "./schemas/hotel.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class HotelService {
  constructor(
    @InjectModel(Hotel.name) private readonly hotelModel: Model<Hotel>
  ) {}

  async create(createHotelInput: CreateHotelInput): Promise<Hotel> {
    return this.hotelModel.create(createHotelInput);
  }

  async findAll(): Promise<Hotel[]> {
    return this.hotelModel.find();
  }

  async findOne(id: Types.ObjectId): Promise<Hotel | null> {
    const hotel = await this.hotelModel.findById(id);

    if (!hotel) {
      throw new NotFoundException("Hotel not found");
    }

    return hotel;
  }

  async update(
    id: Types.ObjectId,
    updateHotelInput: UpdateHotelInput
  ): Promise<Hotel | null> {
    return this.hotelModel.findByIdAndUpdate(id, updateHotelInput);
  }

  async remove(id: Types.ObjectId): Promise<Hotel | null> {
    return this.hotelModel.findByIdAndDelete(id);
  }
}
