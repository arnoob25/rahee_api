import { Global, Module } from "@nestjs/common";
import { CommonService } from "./common.service";
import { CommonResolver } from "./common.resolver";
import { MongooseModule } from "@nestjs/mongoose";
import { Media, MediaSchema } from "./schemas/media.schema";

@Global()
@Module({
  imports: [
    MongooseModule.forFeature([{ name: Media.name, schema: MediaSchema }]),
  ],
  providers: [CommonResolver, CommonService],
  exports: [CommonService],
})
export class CommonModule {}
