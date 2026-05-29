import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    domains: [
      "www.cimentoitambe.com.br",
      "uploads.polemicaparaiba.com.br",
      "hebbkx1anhila5yf.public.blob.vercel-storage.com",
      "supbrokers.s3.us-east-2.amazonaws.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

const withSerwist = withSerwistInit({
  swSrc: "src/app/sw.ts",
  swDest: "public/sw.js",
  // Desativa o SW em dev para não interferir no HMR.
  disable: process.env.NODE_ENV === "development",
  reloadOnOnline: true,
});

export default withSerwist(nextConfig);
