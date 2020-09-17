// next는 기본으로 webpack 함수가 들어 있다.
// config를 통해서 기본 설정을 바꿔준다.
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer({
  compress: true, // gzip으로 압축한다. -> 브라우저가 다시 압축해제를 함, 따로 플러그인 설치 필요 x
  webpack(config, { webpack }) {
    const prod = process.env.NODE_ENV === 'production';

    return {
      ...config,
      mode: prod ? 'production' : 'development',
      // hidden-source-map 을 안하면 배포 환경에서 소스코드 다 노출됨
      devtool: prod ? 'hidden-source-map' : 'eval',
      //   module: {
      //     ...config.module,
      //     rules: [...config.module.rules, {}],
      //   },
      plugins: [
        ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
      ],
    };
  },
});
