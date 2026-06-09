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
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "ALLOWALL" },
          { key: "Content-Security-Policy", value: "frame-ancestors *;" },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.CORS_ORIGINS || "*",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET, POST, PUT, DELETE, OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
