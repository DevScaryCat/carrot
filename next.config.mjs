/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "avatars.githubusercontent.com" },
      { hostname: "picsum.photos" },
      { hostname: "imagedelivery.net" },
    ],
  },
};

export default nextConfig;
