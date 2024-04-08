module.exports.fetchNetworkName = async function (chain) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === undefined
  ) {
    if (chain === 'Ethereum') {
      return 'sepolia'
    }
  } else if (process.env.NODE_ENV === 'production') {
    if (chain === 'Ethereum') {
      return 'mainnet'
    }
  }
}
