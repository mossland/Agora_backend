require('dotenv').config()
require('@nomiclabs/hardhat-ethers')
require('@nomiclabs/hardhat-etherscan')
require('@nomicfoundation/hardhat-chai-matchers')
require('hardhat-change-network')

const {
  LUNIVERSE_NODE_URL,
  SEPOLIA_NODE_URL,
  PRIVATE_KEY
} = process.env

module.exports = {
  solidity: {
    version: '0.8.0',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  defaultNetwork: 'luniverse',
  networks: {
    hardhat: {},
    luniverse: {
      url: LUNIVERSE_NODE_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    },
    sepolia: {
      url: SEPOLIA_NODE_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  }
}
