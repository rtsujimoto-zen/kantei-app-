import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = process.env.NODE_ENV === 'development'
      ? 'http://127.0.0.1:8000'
      : (process.env.NEXT_PUBLIC_API_URL || 'https://kantei-api-538317999249.us-central1.run.app');

    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`, // Proxy to Backend
      },
    ];
  },
};

export default nextConfig;
