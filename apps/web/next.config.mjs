import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Image Docker ramping (server mandiri) — untuk deploy container terisolasi.
  output: "standalone",
  // Kunci root ke folder app ini (ada beberapa lockfile di mesin -> hindari salah deteksi).
  outputFileTracingRoot: __dirname,
  // Data kanonik = statis, di-bundle. Tidak ada fetch API pihak-ketiga saat runtime.
};

export default nextConfig;
