import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
};

export default nextConfig;
