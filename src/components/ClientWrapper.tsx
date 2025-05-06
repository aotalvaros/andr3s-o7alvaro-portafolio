"use client";

import dynamic from "next/dynamic";

// Ahora aquí sí podemos hacer dynamic import client-side
const About = dynamic(() => import('@/components/sections/about').then(mod => mod.About));

export function ClientWrapper() {
  return (
    <About />
  );
}