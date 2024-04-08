const { Network } = require('alchemy-sdk')

module.exports.fetchAlchemyNetwork = async function (chain) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === undefined
  ) {
    if (chain === 'Ethereum') {
      return {
        apiKey: process.env.API_KEY_TEST,
        network: Network.ETH_GOERLI
      }
    }
  } else if (process.env.NODE_ENV === 'production') {
    if (chain === 'Ethereum') {
      return {
        apiKey: process.env.API_KEY_PROD,
        network: Network.ETH_MAINNET
      }
    }
  }
}

module.exports.fetchAlchemyApiKey = async function (chain) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === undefined
  ) {
    if (chain === 'Ethereum') {
      return process.env.API_KEY_TEST
    } else if (chain === 'Polygon') {
      return process.env.API_KEY_POLYGON_TEST
    }
  } else if (process.env.NODE_ENV === 'production') {
    if (chain === 'Ethereum') {
      return process.env.API_KEY_PROD
    } else if (chain === 'Polygon') {
      return process.env.API_KEY_POLYGON_PROD
    }
  }
}

module.exports.fetchAlchemyApiUrl = async function (chain) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === undefined
  ) {
    if (chain === 'Ethereum') {
      return 'https://eth-goerli.g.alchemy.com/nft/v2/'
    } else if (chain === 'Polygon') {
      return 'https://polygon-mumbai.g.alchemy.com/nft/v2/'
    }
  } else if (process.env.NODE_ENV === 'production') {
    if (chain === 'Ethereum') {
      return 'https://eth-mainnet.g.alchemy.com/nft/v2/'
    } else if (chain === 'Polygon') {
      return 'https://polygon-mainnet.g.alchemy.com/nft/v2/'
    }
  }
}

module.exports.fetchAlchemyApiUrlGeneric = async function (chain) {
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.NODE_ENV === undefined
  ) {
    if (chain === 'Ethereum') {
      return process.env.API_URL
    } else if (chain === 'Polygon') {
      return process.env.API_URL_POLYGON_TEST
    }
  } else if (process.env.NODE_ENV === 'production') {
    if (chain === 'Ethereum') {
      return process.env.API_URL_PROD
    } else if (chain === 'Polygon') {
      return process.env.API_URL_POLYGON_PROD
    }
  }
}
