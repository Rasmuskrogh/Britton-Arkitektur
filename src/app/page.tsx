import Header from "@/components/Header";
import ImageSwitcher from "@/components/ImageSwitcher";
import Footer from "@/components/Footer";
import { getGalleryImageUrls } from "@/lib/cloudinary";

export default async function Home() {
  const galleryImages = await getGalleryImageUrls();
  return (
    <>
      <Header />
      <main>
        <ImageSwitcher images={galleryImages} />
      </main>
      <Footer />
    </>
  );
}
