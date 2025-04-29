import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Media } from "./schemas/media.schema";
import { Model, Types } from "mongoose";

@Injectable()
export class CommonService {
  constructor(
    @InjectModel(Media.name) private readonly mediaModel: Model<Media>
  ) {}

  async findMediaByIds(ids: Types.ObjectId[]): Promise<Media[]> {
    return this.mediaModel.find({ _id: { $in: ids } });
  }
}
