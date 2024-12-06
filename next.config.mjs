/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Remove the alias configuration
    return config;
  },
};

export default nextConfig;
