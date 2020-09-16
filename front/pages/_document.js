// _app.js 위에 있는 파일
import React from 'react';
import Document, { Html, Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

// 제일 위의 html, body를 수정할 수 있다.
export default class MyDocument extends Document {
  // getInitialProps -> _document 나 _app 에서만 쓰는 특수한 메서드 (조만간 사라질 수 있음)
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    // styled-components 의 ssr 방식
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      // Document에다가 styled-components를 ssr해줄 수 있게 하는 기능
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App) => (props) =>
            // eslint-disable-next-line react/jsx-props-no-spreading
            sheet.collectStyles(<App {...props} />),
        });
      const initlalProps = await Document.getInitialProps(ctx);

      return {
        ...initlalProps,
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

    return {
      ...initialProps,
    };
  }

  render() {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          {/* IE 지원을 위해 polyfill.io 이용 */}
          <script src="https://polyfill.io/v3/polyfill.min.js?features=default%2Ces2015%2Ces2016%2Ces2017%2Ces2018%2Ces2019" />
          <NextScript />
        </body>
      </Html>
    );
  }
}
