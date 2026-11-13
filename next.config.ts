import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: "/work/sneaker-website",
        destination: "/work/avengers-website",
        permanent: false,
      },
      {
        source: "/work/seven-star-luxury-hotel-cafe",
        destination: "/work/seven-star-luxury-hotel",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
