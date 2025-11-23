"use client"

import Link from 'next/link'
import { FallbackImage } from '@/components/layout/FallbackImage'

interface LogoProps {
  logoSrc: string
}

export function Logo({ logoSrc }: Readonly<LogoProps>) {
  return (
    <Link 
      href="/" 
      className="relative w-[18%] h-[68px] min-w-[120px] max-w-[180px] flex items-center" 
      data-testid="logo-link"
    >
      <FallbackImage
        src={logoSrc}
        alt="Logo"
        width={155}
        height={90}
        className="object-contain w-full h-auto max-w-full max-h-full select-none"
        loading="lazy"
      />
    </Link>
  )
}