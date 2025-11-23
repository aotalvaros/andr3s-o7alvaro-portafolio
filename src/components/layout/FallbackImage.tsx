"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

interface FallbackImageProps extends ImageProps {
  fallbackSrc?: string;
}

export function FallbackImage({
  src,
  fallbackSrc = "/assets/iconNofound.png",
  alt,
  ...rest
}: FallbackImageProps) {

  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  const handleError = () => {
    if (currentSrc !== fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  return (
    <Image
      {...rest}
      src={currentSrc}
      alt={alt}
      onError={handleError}
      width={50}
      height={50}
    />
  );
}
