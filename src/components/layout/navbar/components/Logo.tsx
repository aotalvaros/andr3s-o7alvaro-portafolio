"use client"

import Link from 'next/link'
import Image from 'next/image'

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
      <Image
        src={logoSrc}
        alt="Logo"
        width={155}
        height={90}
        className="object-cover w-[33dvw] min-w-[120px] md:w-[90%] select-none"
        loading="lazy"
      />
    </Link>
  )
}