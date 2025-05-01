import { Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { CommonService } from "../common.service";
import { Review } from "../schemas/review.schema";
import { User } from "../schemas/user.schema";

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly commonService: CommonService) {}

  @ResolveField("author", () => User, {
    description: "Finds and returns the user (author) of the review.",
  })
  async getReviewer(@Parent() review: Review) {
    return this.commonService.findUserById(review.authorId);
  }
}
