"use client"

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react';

interface LogoProps {
  logoSrc: string
}

export function Logo({ logoSrc }: Readonly<LogoProps>) {
  const [imageSrc, setImageSrc] = useState(logoSrc);
  return (
    <Link 
      href="/" 
      className="relative w-[18%] h-[68px] min-w-[120px] max-w-[180px] flex items-center" 
      data-testid="logo-link"
    >
      <Image
        src={imageSrc}
        alt="Logo"
        width={155}
        height={90}
        className="object-contain w-full h-auto max-w-full max-h-full select-none"
        loading="lazy"
         onError={() => {
          // Si la imagen falla, cambia a la imagen por defecto
          setImageSrc("/assets/imageNoFound.png");
        }}
      />
    </Link>
  )
}