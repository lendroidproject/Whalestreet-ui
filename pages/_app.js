import React from 'react'
import Head from 'next/head'
import NextApp from 'next/app'
import { ThemeProvider } from 'styled-components'

import { Provider } from 'react-redux'
import withRedux from 'next-redux-wrapper'
import configureStore from 'store'

import Layout from 'layouts'

import '@trendmicro/react-dropdown/dist/react-dropdown.css'

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
          <title>Whalestreet UI</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <meta charSet="utf-8" />
          <link href="https://necolas.github.io/normalize.css/latest/normalize.css" rel="stylesheet" type="text/css" />
          <link href="https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
          <style
            dangerouslySetInnerHTML={{
              __html: `
              :root {
                --font-family: 'Space Mono', monospace;
                --color-black: #000000;
                --color-white: #ffffff;
                --color-red: #eb0f0f;
                --color-blue: #0600cc;
                --color-gold: #fff400;
                --color-cyan: #3d9fff;
                --color-light-blue: #413bff;
                --color-grey: #f2f2f2;
                --color-border: #d6d6d6;
                --box-shadow: 1px 7px 3px 0 rgba(0,0,0,0.5);
                --box-shadow-narrow: 0 2px 4px 0 rgba(0,0,0,0.5);
              }
              body { font-family: var(--font-family); font-weight: bold; font-size: 16px; line-height: 24px; color: var(--color-black); }
              body * { box-sizing: border-box; }
              a, button, .cursor { cursor: pointer; user-select: none; }
              button, input { font-weight: bold; }
              .center { text-align: center; }
              .flex { display: flex; }
              .flex-all { display: flex; flex-direction: column; justify-content: center; align-items: center; }
              .flex-wrap { display: flex; flex-wrap: wrap; }
              .flex-center { display: flex; align-items: center; }
              .flex-column { display: flex; flex-direction: column; }
              .flex-end { display: flex; align-items: flex-end; }
              .justify-center { justify-content: center; }
              .justify-between { justify-content: space-between; }
              .justify-around { justify-content: space-around; }
              .relative { position: relative }
              .fill { position: absolute; left: 0; right: 0; top: 0; bottom: 0; }
              button { border: none; }
              h1, h2, h3, h4, h5, p { margin-top: 0; }
              .uppercase { text-transform: uppercase; }
              .light { font-weight: normal; }

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
          <link rel="manifest" href="/manifest/manifest.json" />
          <meta name="msapplication-TileColor" content="#ffffff" />
          <meta name="msapplication-TileImage" content="/manifest/ms-icon-144x144.png" />
          <meta name="theme-color" content="#ffffff" />
          {process.env.NODE_ENV === 'production' && (
            <script
              dangerouslySetInnerHTML={{
                __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','GTM-KJNBZPW');`,
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
