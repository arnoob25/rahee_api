import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Media } from "./schemas/media.schema";
import { Model, Types } from "mongoose";
import { Review } from "./schemas/review.schema";
import { User } from "./schemas/user.schema";

@Injectable()
export class CommonService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>,
    @InjectModel(Review.name) private readonly reviewModel: Model<Review>
  ) {}

  async findUserById(id: Types.ObjectId): Promise<User> {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new NotFoundException(`No user with the id: ${String(id)} exists`);
    }

    return user;
  }

  async findMediaByIds(ids: Types.ObjectId[]): Promise<Media[]> {
    return this.mediaModel.find({ _id: { $in: ids } });
  }

  async findReviewsByHotelId(id: Types.ObjectId): Promise<Review[]> {
    return this.reviewModel.find({ hotelId: id });
  }
}
