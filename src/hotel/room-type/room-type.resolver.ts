import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { Room } from "../schemas/room.schema";
import { RoomType } from "../schemas/room-type.schema";
import { RoomService } from "../room/room.service";
import { Media } from "src/common/schemas/media.schema";
import { CommonService } from "src/common/common.service";
import { RoomTypeService } from "./room-type.service";

@Resolver(() => RoomType)
export class RoomTypeResolver {
  constructor(
    private readonly roomTypeService: RoomTypeService,
    private readonly roomService: RoomService,
    private readonly commonService: CommonService
  ) {}

  @ResolveField("rooms", () => [Room], {
    description: "Finds the individual rooms of this room type.",
  })
  async getRooms(@Parent() roomType: RoomType) {
    return this.roomService.findByRoomType(roomType._id);
  }

  @ResolveField("roomCount", () => Number, {
    description: "Finds and counts the individual rooms for this room type.",
  })
  async countRooms(@Parent() roomType: RoomType) {
    return (await this.roomService.findByRoomType(roomType._id)).length;
  }

  @ResolveField("media", () => [Media], {
    description:
      "Finds all associated media (videos, images) for each room type",
  })
  async getMedia(@Parent() roomType: RoomType) {
    return this.commonService.findMediaByIds(roomType.mediaIds);
  }
}
