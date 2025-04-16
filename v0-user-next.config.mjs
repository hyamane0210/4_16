/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development experience
  reactStrictMode: true,

  // 画像最適化の設定
  images: {
    // 画像最適化を完全に無効にする
    unoptimized: true,
    // 許可するドメインを明示的に指定
    domains: [
      'i.scdn.co',
      'scdn.co',
      'spotifycdn.com',
      'image.tmdb.org',
      'themoviedb.org',
      'cloudfront.net',
      'amazonaws.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  // Enable compression
  compress: true,

  // Optimize fonts
  optimizeFonts: true,

  // Disable x-powered-by header
  poweredByHeader: false,

  // Enable SWC minification for better performance
  swcMinify: true,

  // 実験的な最適化を有効化
  experimental: {
    // 最適化されたサーバーコンポーネントを有効化
    serverComponents: true,
    // コンパイル時の最適化を有効化
    optimizeCss: true,
    // メモリ使用量を最適化
    memoryBasedWorkersCount: true,
    // 静的ページの圧縮を有効化
    gzipSize: true,
    // ページバンドルの分析を有効化
    bundleAnalyzer: process.env.ANALYZE === 'true',
  },

  // CORSヘッダーを設定
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          // キャッシュ制御ヘッダーを追加
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800',
          },
        ],
      },
      // 静的アセット用のキャッシュヘッダー
      {
        source: '/(.*).(jpg|jpeg|png|gif|webp|svg|ico|ttf|woff|woff2)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },

  // 出力の最適化
  output: 'standalone',
};

export default nextConfig
