import { registerEnumType } from "@nestjs/graphql";

export enum Accommodation {
  Hotel = "hotel",
  Resort = "resort",
  Motel = "motel",
  BedAndBreakfast = "bed_and_breakfast",
  Guesthouse = "guesthouse",
  Hostel = "hostel",
  Villa = "villa",
  ServicedApartment = "serviced_apartment",
}

export enum Tag {
  Beach = "beach",
  Luxury = "luxury",
  Family = "family",
  Budget = "budget",
}

export enum Facility {
  // Recreation
  Pool = "pool",
  Tennis = "tennis",
  Yoga = "yoga",
  Golf = "golf",

  // Childcare
  KidsClub = "kids_club",
  Babysitting = "babysitting",
  ArtStudio = "art_studio",
  Playground = "playground",

  // Business
  Networking = "networking",
  Office = "office",
  Collaboration = "collaboration",

  // Accessibility
  Wheelchair = "wheelchair",
  VisualAlert = "visual_alert",

  // Entertainment
  Gaming = "gaming",
  LiveMusic = "live_music",
  Cinema = "cinema",
  EscapeRoom = "escape_room",
}

export enum RoomCategory {
  Economy = "economy",
  Standard = "standard",
  Deluxe = "deluxe",
  Suite = "suite",
}

export enum BedType {
  Single = "single",
  Double = "double",
  Queen = "queen",
  King = "king",
  Sofa = "sofa",
}

export enum Amenity {
  Wifi = "wifi",
  Breakfast = "breakfast",
  SmartTv = "smart_tv",
  Workspace = "workspace",
  Jacuzzi = "jacuzzi",
  GameConsole = "game_console",
  KidsBunkBed = "kids_bunk_bed",
  InRoomSafe = "in_room_safe",
}

export enum MediaType {
  Image = "image",
  Video = "video",
}

export enum PolicyRule {
  // Check-in/Check-out
  StandardCheckIn = "standard_check_in",
  EarlyCheckIn = "early_check_in",
  LateCheckIn = "late_check_in",
  RequiredDocuments = "required_documents",
  StandardCheckOut = "standard_check_out",
  LateCheckOut = "late_check_out",
  ExpressCheckOut = "express_check_out",
  LuggageStorage = "luggage_storage",
  PorterService = "porter_service",
  TwoPMCheckIn = "two_pm_check_in",
  ElevenAMCheckOut = "eleven_am_check_out",
  PayAtCheckOut = "pay_at_check_out",

  // Payment & Deposits
  CreditCards = "credit_cards",
  Cash = "cash",
  DigitalWallets = "digital_wallets",
  BookingDeposit = "booking_deposit",
  IncidentalHold = "incidental_hold",
  FreeCancellation = "free_cancellation",
  LateCancellation = "late_cancellation",
  NoShowPolicy = "no_show_policy",
  ResortFee = "resort_fee",
  Parking = "parking",
  PetFee = "pet_fee",

  // Property Rules
  QuietHours = "quiet_hours",
  ExcessiveNoise = "excessive_noise",
  NonSmokingRooms = "non_smoking_rooms",
  DesignatedSmokingAreas = "designated_smoking_areas",
  ViolationFee = "violation_fee",
  AllowedPets = "allowed_pets",
  PetAmenities = "pet_amenities",
  ServiceAnimals = "service_animals",
  HoursOfOperation = "hours_of_operation",
  AgeRestrictions = "age_restrictions",
  ProperAttire = "proper_attire",

  // Additional Policies
  WiFiAvailability = "wifi_availability",
  PremiumWiFi = "premium_wifi",
  SelfParking = "self_parking",
  ValetParking = "valet_parking",
  ElectricVehicleCharging = "electric_vehicle_charging",
  MinimumCheckInAge = "minimum_check_in_age",
  Minors = "minors",
  ADACompliantRooms = "ada_compliant_rooms",
  MobilityEquipment = "mobility_equipment",
}

export enum City {
  Dhaka = "dhaka",
  Chittagong = "chittagong",
  Khulna = "khulna",
  Sylhet = "sylhet",
  Rajshahi = "rajshahi",
  Barishal = "barishal",
  Rangpur = "rangpur",
  Mymensingh = "mymensingh",
}

export enum State {
  DhakaDivision = "dhaka_division",
  ChittagongDivision = "chittagong_division",
  KhulnaDivision = "khulna_division",
  SylhetDivision = "sylhet_division",
  RajshahiDivision = "rajshahi_division",
  BarishalDivision = "barishal_division",
  RangpurDivision = "rangpur_division",
  MymensinghDivision = "mymensingh_division",
}

export enum Country {
  Bangladesh = "bangladesh",
  India = "india",
  Usa = "usa",
  Canada = "canada",
  Uk = "uk",
  Australia = "australia",
}

export enum LocationType {
  Country = "country",
  City = "city",
  TouristAttraction = "attraction",
  Property = "property",
}

registerEnumType(Accommodation, {
  name: "Accommodation",
  description: "Type of accommodation. Example: Hotel, Resort, etc.",
});

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

registerEnumType(City, {
  name: "CityEnum",
  description: "Supported cities for location filtering.",
});

registerEnumType(State, {
  name: "StateEnum",
  description: "Supported states or divisions for location filtering.",
});

registerEnumType(Country, {
  name: "CountryEnum",
  description: "Supported countries for location filtering.",
});

registerEnumType(LocationType, {
  name: "LocationType",
  description: "Type of the location. Example: Country, City, Property, etc.",
});
