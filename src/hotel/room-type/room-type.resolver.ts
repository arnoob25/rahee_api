import { Parent, ResolveField, Resolver } from "@nestjs/graphql"
import { Room } from "../entities/room.entity";
import { RoomType } from "../entities/room-type.entity";
import { RoomService } from "../room/room.service";

@Resolver(() => RoomType)
export class RoomTypeResolver {
  constructor(
    private readonly roomService: RoomService
  ) {}

  @ResolveField("rooms", () => [Room], {
    description: "Finds the individual rooms of this room type.",
  })
  async getRooms(@Parent() roomType: RoomType) {
    return this.roomService.findByRoomType(roomType._id);
  }
}
