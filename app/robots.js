export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://civilcalc-app.vercel.app/sitemap.xml',
  }
}
