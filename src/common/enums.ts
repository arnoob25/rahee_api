import { registerEnumType } from "@nestjs/graphql";

export enum SORT_ORDER {
  ASC = "asc",
  DSC = "dsc",
}

registerEnumType(SORT_ORDER, {
  name: "SortingOrder",
  description:
    "Describes whether the sort should be in ascending or descending order. Example: asc/ dsc.",
});
