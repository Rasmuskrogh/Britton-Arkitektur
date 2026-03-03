"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

const FADE_MS = 500;
const INTERVAL_MS = 5000;

type ImageSwitcherProps = {
  /** Om utelämnas hämtas bilder från /api/gallery (env används endast där) */
  images?: string[];
  alt?: string;
  /** Aspect ratio, default A4 (842×596) */
  aspectRatio?: string;
};

export default function ImageSwitcher({
  images: imagesProp = [],
  alt = "",
  aspectRatio = "842/596",
}: ImageSwitcherProps) {
  const [images, setImages] = useState<string[]>(imagesProp);
  const [index, setIndex] = useState(0);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (imagesProp.length > 0) {
      setImages(imagesProp);
      return;
    }
    fetch("/api/gallery")
      .then((res) => res.json())
      .then((data: { images?: string[] }) => setImages(data.images ?? []))
      .catch(() => setImages([]));
  }, [imagesProp.length]);

  useEffect(() => {
    if (images.length <= 1) return;
    let timeoutId: ReturnType<typeof setTimeout>;
    const id = setInterval(() => {
      setTransitioning(true);
      timeoutId = setTimeout(() => {
        setIndex((i) => (i + 1) % images.length);
        setTransitioning(false);
      }, FADE_MS);
    }, INTERVAL_MS);
    return () => {
      clearInterval(id);
      clearTimeout(timeoutId!);
    };
  }, [images.length]);

  if (!images.length) return null;

  const nextIndex = (index + 1) % images.length;
  const currentSrc = images[index];
  const nextSrc = images[nextIndex];

  return (
    <div
      className="image-switcher"
      style={{ aspectRatio, position: "relative", width: "100%", overflow: "hidden" }}
    >
      <div
        className="image-switcher__layer"
        style={{
          position: "absolute",
          inset: 0,
          opacity: transitioning ? 0 : 1,
          transition: transitioning ? `opacity ${FADE_MS}ms ease-in-out` : "none",
        }}
      >
        <Image
          src={currentSrc}
          alt={alt}
          fill
          sizes="(max-width: 900px) 100vw, 900px"
          style={{ objectFit: "cover" }}
        />
      </div>
      {images.length > 1 && (
        <div
          className="image-switcher__layer"
          style={{
            position: "absolute",
            inset: 0,
            opacity: transitioning ? 1 : 0,
            transition: transitioning ? `opacity ${FADE_MS}ms ease-in-out` : "none",
          }}
        >
          <Image
            src={nextSrc}
            alt={alt}
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
    </div>
  );
}
