import { registerEnumType } from "@nestjs/graphql";

export enum Tag {
  beachfront = "beachfront",
  luxury = "luxury",
  family = "family",
  budget = "budget",
}

export enum Facility {
  pool = "pool",
  gym = "gym",
}

export enum RoomCategory {
  economy = "economy",
  standard = "standard",
  deluxe = "deluxe",
  suite = "suite",
}

export enum BedType {
  single = "single",
  double = "double",
  queen = "queen",
  king = "king",
  sofa = "sofa",
}

export enum Amenity {
  wifi = "wifi",
  tv = "tv",
  pool = "pool",
}

export enum MediaType {
  image = "image",
  video = "video",
}

registerEnumType(Tag, {
  name: "Tag",
  description:
    "Generic labels that highlights key features of a hotel. Example: Family Friendly, Budget Friendly.",
});

registerEnumType(Facility, {
  name: "Facility",
  description:
    "Facilities offered by the hotel. Example: 24hr Check in, Pool Access, etc.",
});

registerEnumType(RoomCategory, {
  name: "RoomCategory",
  description:
    "Category of rooms in a hotel. Each category holds several room types. Example: Suite category may hold room types: Family Suite, Penthouse Suite.",
});

registerEnumType(BedType, {
  name: "BedType",
  description:
    "Describes the type of bed for a room type. Example: Single bed, double bed, etc.",
});

registerEnumType(Amenity, {
  name: "Amenity",
  description:
    "Perks that come with the room. Example: Free wifi, Room service, etc.",
});

registerEnumType(MediaType, {
  name: "MediaType",
  description: "Specifies whether the media is an image or a video.",
});
