import { NextRequest } from "next/server";
import { getModelsByBrand } from "@/lib/data";

export async function GET(request: NextRequest) {
  const brand = request.nextUrl.searchParams.get("brand") || undefined;
  const models = await getModelsByBrand(brand);
  return Response.json({ models });
}
