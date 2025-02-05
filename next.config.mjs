import { setupDevPlatform } from '@cloudflare/next-on-pages/next-dev';
import { createVanillaExtractPlugin } from '@vanilla-extract/next-plugin';

if (process.env.NODE_ENV === 'development') {
  await setupDevPlatform();
};

/** @type {import('next').NextConfig} */
const nextConfig = {
  
};

const withVanillaExtract = createVanillaExtractPlugin();

export default withVanillaExtract(nextConfig);