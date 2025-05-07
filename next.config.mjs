/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
    // Ensure server-side environment variables are available
    serverRuntimeConfig: {
      GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    },
    // Add any other configurations you need
  };
  
  export default nextConfig;
