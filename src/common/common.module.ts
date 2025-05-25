import { Global, Module } from "@nestjs/common";
import { CommonService } from "./common.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Media, MediaSchema } from "./schemas/media.schema";
import { Review, ReviewSchema } from "./schemas/review.schema";
import { User, UserSchema } from "./schemas/user.schema";
import { ReviewResolver } from "./review/review.resolver";
import { Location, LocationSchema } from "./schemas/location.schema";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MongooseModule.forFeature([
      { name: Location.name, schema: LocationSchema },
    ]),
  ],
  providers: [CommonService, ReviewResolver],
  exports: [CommonService],
})
export class CommonModule {}
