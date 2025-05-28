import { Types } from "mongoose";

/**
 * Extracts unique ObjectIds from a flat array of ObjectIds.
 *
 * @param input - An array containing Types.ObjectId
 * @returns A unique array of Types.ObjectId
 */
export function getUniqueObjectIds(input: Types.ObjectId[]): Types.ObjectId[] {
  const uniqueHexSet = new Set(input.map((id) => id.toHexString()));
  return Array.from(uniqueHexSet).map((hex) => new Types.ObjectId(hex));
}
