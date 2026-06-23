const nextConfig = {
  output: 'standalone',

  images: {
    unoptimized: true,
  },

  experimental: {
    serverComponentsExternalPackages: ['mongodb'],
  },

  async redirects() {
    return [
            {
        source: '/terms-of-service',
        destination: '/terms-and-conditions',
        permanent: true,
      },
      {
        source: '/column',
        destination: '/column-design',
        permanent: true,
      },
      {
        source: '/beam',
        destination: '/beam-design',
        permanent: true,
      },
      {
        source: '/footing',
        destination: '/footing-design',
        permanent: true,
      },
      {
        source: '/one-way-slab',
        destination: '/one-way-slab-calculator',
        permanent: true,
      },
      {
        source: '/two-way-slab',
        destination: '/two-way-slab-calculator',
        permanent: true,
      },
    ];
  },

  webpack(config, { dev }) {
    if (dev) {
      config.watchOptions = {
        poll: 2000,
        aggregateTimeout: 300,
        ignored: ['**/node_modules'],
      };
    }
    return config;
  },

  onDemandEntries: {
    maxInactiveAge: 10000,
    pagesBufferLength: 2,
  },

  async headers() {
    return [
      // Protect ALL pages — no one can embed your site in an iframe (clickjacking protection)
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self';" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
      // Allow CORS only for your API routes (not the whole site)
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.CORS_ORIGINS || "https://civilcalcpro.in",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "Content-Type, Authorization",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
