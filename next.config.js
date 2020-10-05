require('dotenv').config()
const withOffline = require('next-offline')
const withImages = require('next-images')

module.exports = withOffline({
  env: {
    MAIN_NETWORK: process.env.MAIN_NETWORK === 'true',
  },
  reactStrictMode: true,
  trailingSlash: false,
  poweredByHeader: false,
  // target: 'serverless',
  // exportPathMap: async function (defaultPathMap, { dev, dir, outDir, distDir, buildId }) {
  //   return {
  //     '/': { page: '/' },
  //     '/about': { page: '/about' },
  //     '/p/hello-nextjs': { page: '/post', query: { title: 'hello-nextjs' } },
  //     '/p/learn-nextjs': { page: '/post', query: { title: 'learn-nextjs' } },
  //     '/p/deploy-nextjs': { page: '/post', query: { title: 'deploy-nextjs' } },
  //   }
  // },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 2,
  },
  ...withImages(),
})
