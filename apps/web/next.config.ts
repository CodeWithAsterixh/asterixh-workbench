import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ["@workbench-tools/video-to-frames"],
};

export default nextConfig;
