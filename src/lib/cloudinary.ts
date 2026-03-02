/**
 * Hämtar bild-URL:er från Cloudinary (server-side).
 * Kräver i .env.local: CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
 */
export async function getGalleryImageUrls(): Promise<string[]> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return [];
  }

  const auth = Buffer.from(`${apiKey}:${apiSecret}`).toString("base64");
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?max_results=50`;

  const res = await fetch(url, {
    headers: { Authorization: `Basic ${auth}` },
    next: { revalidate: 60 },
  });

  if (!res.ok) return [];

  const data = (await res.json()) as {
    resources?: Array<{ secure_url: string }>;
  };
  const resources = data.resources ?? [];
  return resources.map((r) => r.secure_url);
}
