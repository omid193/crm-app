import type { NextConfig } from "next";

// const isDev = process.env.NODE_ENV === "development";

const nextConfig: NextConfig = {
  /* config options here */
  // experimental: {
  //   turbopackFileSystemCacheForDev: true,
  // },
  // cacheComponents: !isDev, // در dev = false، در production = true
  // reactCompiler: !isDev, // در dev = false، در production = true
};

export default nextConfig;
