import { registerEnumType } from "@nestjs/graphql";

export enum Tag {
  beach = "beach",
  luxury = "luxury",
  family = "family",
  budget = "budget",
}

export enum Facility {
  pool = "pool",
  gym = "gym",
  cinema = "cinema",
  conference = "conference",
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
  breakfast = "breakfast",
}

export enum MediaType {
  image = "image",
  video = "video",
}

export enum PolicyRule {
  // Check-in/Check-out
  StandardCheckIn = "StandardCheck-in",
  EarlyCheckIn = "EarlyCheck-in",
  LateCheckIn = "LateCheck-in",
  RequiredDocuments = "RequiredDocuments",
  StandardCheckOut = "StandardCheck-out",
  LateCheckOut = "LateCheck-out",
  ExpressCheckOut = "ExpressCheck-out",
  LuggageStorage = "LuggageStorage",
  PorterService = "PorterService",

  // Payment & Deposits
  CreditCards = "CreditCards",
  Cash = "Cash",
  DigitalWallets = "DigitalWallets",
  BookingDeposit = "BookingDeposit",
  IncidentalHold = "IncidentalHold",
  FreeCancellation = "FreeCancellation",
  LateCancellation = "LateCancellation",
  NoShowPolicy = "No-showPolicy",
  ResortFee = "ResortFee",
  Parking = "Parking",
  PetFee = "PetFee",

  // Property Rules
  QuietHours = "QuietHours",
  ExcessiveNoise = "ExcessiveNoise",
  NonSmokingRooms = "Non-smokingRooms",
  DesignatedSmokingAreas = "DesignatedSmokingAreas",
  ViolationFee = "ViolationFee",
  AllowedPets = "AllowedPets",
  PetAmenities = "PetAmenities",
  ServiceAnimals = "ServiceAnimals",
  HoursOfOperation = "HoursOfOperation",
  AgeRestrictions = "AgeRestrictions",
  ProperAttire = "ProperAttire",

  // Additional Policies
  WiFiAvailability = "WiFiAvailability",
  PremiumWiFi = "PremiumWiFi",
  SelfParking = "Self-parking",
  ValetParking = "ValetParking",
  ElectricVehicleCharging = "ElectricVehicleCharging",
  MinimumCheckInAge = "MinimumCheck-inAge",
  Minors = "Minors",
  ADACompliantRooms = "ADACompliantRooms",
  MobilityEquipment = "MobilityEquipment",
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

registerEnumType(PolicyRule, {
  name: "PolicyRule",
  description:
    "Specifies the rule the hotel conforms to. Example: No check out after 12 pm.",
});
