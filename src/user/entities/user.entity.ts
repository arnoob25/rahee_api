import { ObjectType, Field, Int } from "@nestjs/graphql";

@ObjectType()
export class User {
  @Field({ description: "Name of the user" })
  name: string;

  @Field({ description: "Age of the user" })
  age: number;

  @Field({ description: "Email of the user" })
  email: string;
}
