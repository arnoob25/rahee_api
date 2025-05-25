import { Types } from "mongoose";
import { FilterHotelsInput } from "./dto/filter-hotels.input";
import { BadRequestException } from "@nestjs/common";

export type HotelFilters = {
  type?: string; // accommodation type e.g. hotel, resort
  locationId?: Types.ObjectId;
  city?: string;
  reviewScore?: number;
  starRating?: number;
  tags?: string[];
  facilities?: string[];
};

export type RoomTypeFilters = {
  adults: number;
  amenities?: string[];
  children?: number;
  minPrice?: number;
  maxPrice?: number;
};

export type RoomFilters = {
  checkInDate: Date;
  checkOutDate: Date;
};

export function getHotelFilters(input: FilterHotelsInput): HotelFilters {
  if (!input.city && !input.locationId) {
    throw new BadRequestException(
      "Either city or location must be provided to filter hotels."
    );
  }

  return {
    type: input.type,
    city: input.city,
    locationId: input.locationId
      ? new Types.ObjectId(input.locationId)
      : undefined,
    reviewScore: input.reviewScore,
    starRating: input.starRating,
    tags: input.tags,
    facilities: input.facilities,
  };
}

export function getRoomTypeFilters(input: FilterHotelsInput): RoomTypeFilters {
  if (input.minPrice && !input.maxPrice) {
    throw new BadRequestException(
      "Max price not provided along with min price"
    );
  }

  if (!input.minPrice && input.maxPrice) {
    throw new BadRequestException(
      "Min price not provided along with max price"
    );
  }

  if (input.minPrice && input.maxPrice && input.maxPrice < input.minPrice) {
    throw new BadRequestException("Max price must be greater than min price");
  }

  return {
    adults: input.adults,
    amenities: input.amenities,
    children: input.children,
    maxPrice: input.maxPrice,
    minPrice: input.minPrice,
  };
}

export function getRoomFilters(input: FilterHotelsInput): RoomFilters {
  const checkInDate = new Date(input.checkInDate);
  const checkOutDate = new Date(input.checkOutDate);

  if (checkOutDate <= checkInDate) {
    throw new BadRequestException(
      "Check-out date must be greater than check-in date."
    );
  }

  return {
    checkInDate,
    checkOutDate,
  };
}
