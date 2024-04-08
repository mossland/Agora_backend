module.exports.fetchChainNode = async function (chain) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === undefined
  ) {
    if (chain === 'Ethereum') {
      return process.env.API_KEY_TEST
    }
  } else if (process.env.NODE_ENV === 'production') {
    if (chain === 'Ethereum') {
      return process.env.API_KEY_PROD
    }
  }
}
