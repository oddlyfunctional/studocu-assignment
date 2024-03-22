import locales from "./src/i18n/locales.json" with { type: "json" };

/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales,
    defaultLocale: "en",
    localeDetection: false
  },
};

export default nextConfig;
