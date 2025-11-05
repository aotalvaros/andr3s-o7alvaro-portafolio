import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      'mars.jpl.nasa.gov', 
      'mars.nasa.gov', 
      'www.nasa.gov',
      'raw.githubusercontent.com',
      'assets.pokemon.com',
      's6s2oxgnpnutegmr.public.blob.vercel-storage.com',
    ],
  }
};

export default nextConfig;
