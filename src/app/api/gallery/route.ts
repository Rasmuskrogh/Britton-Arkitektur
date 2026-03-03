import { getGalleryImageUrls } from "@/lib/cloudinary";
import { NextResponse } from "next/server";

export async function GET() {
  const images = await getGalleryImageUrls();
  return NextResponse.json({ images });
}
