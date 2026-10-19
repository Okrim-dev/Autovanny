import { NextRequest } from "next/server";
import { countCars, parseCarFilters } from "@/lib/data";

export async function GET(request: NextRequest) {
  const filters = parseCarFilters(request.nextUrl.searchParams);
  const total = await countCars(filters);
  return Response.json({ total });
}
