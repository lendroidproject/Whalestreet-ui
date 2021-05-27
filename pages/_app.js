import React from 'react'
import Head from 'next/head'
import NextApp from 'next/app'
import { ThemeProvider } from 'styled-components'

import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import configureStore from 'store'

import Layout from 'layouts'
import { mediaSize } from 'utils/media'

import MagicCss from '@frontend-ninjas/magic-css'
import 'react-perfect-scrollbar/dist/css/styles.css'

const magic = new MagicCss({
  fontFamily: 'Space Mono, monospace',
  colors: [
    ['red', '#eb0f0f'],
    ['red1', '#ff0006'],
    ['red2', '#bd84a3'],
    ['red3', '#ffacb8'],
    ['blue', '#0600cc'],
    ['yellow', '#fde92a'],
    ['gold', '#fff400'],
    ['cyan', '#3d9fff'],
    ['light-blue', '#413bff'],
    ['grey', '#f2f2f2'],
    ['dark-grey', '#979797'],
    ['border', '#d6d6d6'],
    ['border2', '#5752fc'],
    ['trans', 'rgba(255, 255, 255, 0.5)'],
    ['trans07', 'rgba(255, 255, 255, 0.7)'],
    ['blue1', '#8787bb'],
    ['blue2', '#9898bc'],
    ['light-purple', '#fae0df'],
    ['green', '#2fb2ba'],
    ['grey2', '#898989'],
  ],
  variables: [
    ['border', ['input', '1px solid #d6d6d6']],
    [
      'background',
      ['grad-1', 'linear-gradient(224.6deg, #464975B3 0%, #8A92B2B3 38.25%, #E653B8B3 75.11%, #C43C9AB3 100%)'],
    ],
    [
      'background',
      ['grad-2', 'linear-gradient(224.37deg, #464975B3 0%, #8A92B2B3 38.25%, #55DCE5B3 75.11%, #56DD9CB3 100%)'],
    ],
    [
      'background',
      ['grad-3', 'linear-gradient(224.74deg, #464975B3 0%, #8A92B2B3 38.25%, #F55256B3 74.25%, #FF0006B3 100%)'],
    ],
    ['background', ['opacity-05', 'rgba(0, 0, 0, 0.5)']],
    ['background', ['opacity-09', 'rgba(0, 0, 0, 0.92)']],
    ['box-shadow', '1px 7px 3px 0 rgba(0, 0, 0, 0.5)'],
    ['box-shadow', ['narrow', '0 2px 4px 0 rgba(0, 0, 0, 0.5)']],
    ['box-shadow', ['dark', '6px 6px 17px 0 #121120']],
  ],
  classes: [
    ['light', [['font-wight', 'normal']]],
    ['text-left', [['text-align', 'left']]],
    ['text-right', [['text-align', 'right']]],
  ],
})

const theme = {
  primary: 'default',
}

class App extends NextApp {
  static async getInitialProps({ Component, ctx }) {
    const pageProps = Component.getInitialProps ? await Component.getInitialProps(ctx) : {}
    return { pageProps }
  }

  render() {
    const {
      props: { Component, pageProps, store },
    } = this

    return (
      <>
        <Head>
          <title>WhaleStreet - Get $HRIMP</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
          <link href="https://necolas.github.io/normalize.css/latest/normalize.css" rel="stylesheet" type="text/css" />
          <link
            href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
            rel="stylesheet"
          />
          <style
            dangerouslySetInnerHTML={{
              __html: `
                ${magic.getStyle()}
              :root {
                /* Color */
                --surface: #c0c0c0;
                --button-highlight: #ffffff;
                --button-face: #dfdfdf;
                --button-shadow: #808080;
                --window-frame: #0a0a0a;
                --dialog-blue: #000080;
                --dialog-blue-light: #1084d0;
                --dialog-gray: #808080;
                --dialog-gray-light: #b5b5b5;
                --link-blue: #0000ff;

                /* Spacing */
                --element-spacing: 8px;
                --grouped-button-spacing: 4px;
                --grouped-element-spacing: 6px;
                --radio-width: 12px;
                --checkbox-width: 17px;
                --radio-label-spacing: 6px;
                --range-track-height: 4px;
                --range-spacing: 10px;

                /* Some detailed computations for radio buttons and checkboxes */
                --radio-total-width-precalc: var(--radio-width) + var(--radio-label-spacing);
                --radio-total-width: calc(var(--radio-total-width-precalc));
                --radio-left: calc(-1 * var(--radio-total-width-precalc));
                --radio-dot-width: 4px;
                --radio-dot-top: calc(var(--radio-width) / 2 - var(--radio-dot-width) / 2);
                --radio-dot-left: calc(
                  -1 * (var(--radio-total-width-precalc)) + var(--radio-width) / 2 - var(
                      --radio-dot-width
                    ) / 2
                );

                --checkbox-total-width-precalc: var(--checkbox-width) +
                  var(--radio-label-spacing);
                --checkbox-total-width: calc(var(--checkbox-total-width-precalc));
                --checkbox-left: calc(-1 * var(--checkbox-total-width-precalc));
                --checkmark-width: 7px;
                --checkmark-top: 3px;
                --checkmark-left: 3px;

                /* Borders */
                --border-width: 1px;
                --border-raised-outer: inset -1px -1px var(--window-frame),
                  inset 1px 1px var(--button-highlight);
                --border-raised-inner: inset -2px -2px var(--button-shadow),
                  inset 2px 2px var(--button-face);
                --border-sunken-outer: inset -1px -1px var(--button-highlight),
                  inset 1px 1px var(--window-frame);
                --border-sunken-inner: inset -2px -2px var(--button-face),
                  inset 2px 2px var(--button-shadow);

                /* Window borders flip button-face and button-highlight */
                --border-window-outer: inset -1px -1px var(--window-frame),
                  inset 1px 1px var(--button-face);
                --border-window-inner: inset -2px -2px var(--button-shadow),
                  inset 2px 2px var(--button-highlight);

                /* Field borders (checkbox, input, etc) flip window-frame and button-shadow */
                --border-field: inset -1px -1px var(--button-highlight),
                  inset 1px 1px var(--button-shadow), inset -2px -2px var(--button-face),
                  inset 2px 2px var(--window-frame);
              }
              body {
                font-weight: bold;
                line-height: 1.5;
                color: var(--color-black);
                font-size: 16px;
              }
              body.auctions {
                color: var(--color-blue2);
              }
              ${mediaSize.media3x} { body { font-size: 32px; } }
              ${mediaSize.media2x} { body { font-size: 24px; } }
              ${mediaSize.mobile} { body { font-size: 12px; } }

              button, input { font-weight: bold; }
              .light { font-weight: normal; }
              .full { width: 100%; }
              .underline { text-decoration: underline; }

              *::-webkit-scrollbar { width: 5px; }
              *::-webkit-scrollbar-track { background: transparent; }
              *::-webkit-scrollbar-thumb { border-radius: 5px; background-color: var(--color-black); }
              *::-webkit-scrollbar-thumb:hover { background: var(--color-grey); }
            `,
            }}
          />
          <link rel="apple-touch-icon" sizes="57x57" href="/manifest/apple-icon-57x57.png" />
          <link rel="apple-touch-icon" sizes="60x60" href="/manifest/apple-icon-60x60.png" />
          <link rel="apple-touch-icon" sizes="72x72" href="/manifest/apple-icon-72x72.png" />
          <link rel="apple-touch-icon" sizes="76x76" href="/manifest/apple-icon-76x76.png" />
          <link rel="apple-touch-icon" sizes="114x114" href="/manifest/apple-icon-114x114.png" />
          <link rel="apple-touch-icon" sizes="120x120" href="/manifest/apple-icon-120x120.png" />
          <link rel="apple-touch-icon" sizes="144x144" href="/manifest/apple-icon-144x144.png" />
          <link rel="apple-touch-icon" sizes="152x152" href="/manifest/apple-icon-152x152.png" />
          <link rel="apple-touch-icon" sizes="180x180" href="/manifest/apple-icon-180x180.png" />
          <link rel="icon" type="image/png" sizes="192x192" href="/manifest/android-icon-192x192.png" />
          <link rel="icon" type="image/png" sizes="32x32" href="/manifest/favicon-32x32.png" />
          <link rel="icon" type="image/png" sizes="96x96" href="/manifest/favicon-96x96.png" />
          <link rel="icon" type="image/png" sizes="16x16" href="/manifest/favicon-16x16.png" />
          <link rel="icon" href="/manifest/favicon.ico" />
          <link rel="manifest" href="/manifest/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/manifest/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
          {process.env.NODE_ENV === 'production' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){
                  w[l]=w[l]||[];
                  function gtag(){w[l].push(arguments);}
                  gtag('js', new Date());
                  gtag('config', i);
                  var f=d.getElementsByTagName(s)[0];
                  j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
                  j.async=true;
                  j.src='https://www.googletagmanager.com/gtag/js?id='+i+dl;
                  f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','G-CEVZQESQGT');`,
              }}
            />
          )}
        </Head>
        <ThemeProvider theme={theme}>
          <Provider store={store}>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </Provider>
        </ThemeProvider>
      </>
    )
  }
}

export function reportWebVitals(metric) {
  // console.info(metric)
}

export default withRedux(configureStore)(App)
