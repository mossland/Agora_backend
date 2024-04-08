module.exports.fetchChainId = async function (chain) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === undefined
  ) {
    if (chain === 'Ethereum') {
      return '0x5'
    }
  } else if (process.env.NODE_ENV === 'production') {
    if (chain === 'Ethereum') {
      return '0x1'
    }
  }
}
