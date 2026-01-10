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

 const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  return (
    <Image
      {...rest}
      src={hasError ? fallbackSrc : src}
      alt={alt}
      onError={() => {
        if (!hasError) setHasError(true);
      }}
    />
  );
}
