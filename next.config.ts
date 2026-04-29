import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
    // Ensures resolution stays within this project directory
    resolveAlias: {
      '@prisma/client': './node_modules/@prisma/client',
    },
  },
};

export default nextConfig;
