// _app.js 위에 있는 파일
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

// 제일 위의 html, body를 수정할 수 있다.
export default class MyDocument extends Document {
  static async getInitialProps(ctx) {
    // styled-components 의 ssr 방식
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      // Document에다가 styled-components를 ssr해줄 수 있게 하는 기능
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            sheet.collectStyles(<App {...props} />),
        });

      // getInitialProps -> _document 나 _app 에서만 쓰는 특수한 메서드 (조만간 사라질 수 있음)
      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } catch (error) {
      console.error(error);
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <script src="https://polyfill.io/v3/polyfill.min.js?features=es6,es7,es8,es9,NodeList.prototype.forEach&flags=gated" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
