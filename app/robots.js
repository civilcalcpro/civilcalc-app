export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/dashboard/',
          '/api/',
          '/login',
          '/signup',
          '/forgot-password',
        ],
      },
    ],
    sitemap: 'https://civilcalcpro.in/sitemap.xml',
    host: 'https://civilcalcpro.in',
  }
}
