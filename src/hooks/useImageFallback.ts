import { useState, useEffect } from "react";

export function useImageFallback(initialSrc: string, fallbackSrc: string) {
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    setSrc(initialSrc);
  }, [initialSrc]);

  const handleError = () => {
    if (src !== fallbackSrc) {
      setSrc(fallbackSrc);
    }
  };

  return { src, handleError };
}
