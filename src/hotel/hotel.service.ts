import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateHotelInput } from "./dto/create-hotel.input";
import { UpdateHotelInput } from "./dto/update-hotel.input";
import { InjectModel } from "@nestjs/mongoose";
import { Hotel } from "./entities/hotel.entity";
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

  async findOne(id: string): Promise<Hotel | null> {
    const hotel = await this.hotelModel.findById(new Types.ObjectId(id));

    if (!hotel) {
      throw new NotFoundException("Hotel not found");
    }

    return hotel;
  }

  async update(
    id: string,
    updateHotelInput: UpdateHotelInput
  ): Promise<Hotel | null> {
    return this.hotelModel.findByIdAndUpdate(
      new Types.ObjectId(id),
      updateHotelInput
    );
  }

  async remove(id: string): Promise<Hotel | null> {
    return this.hotelModel.findByIdAndDelete(new Types.ObjectId(id));
  }
}
