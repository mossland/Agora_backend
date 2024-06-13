const hardhat = require('hardhat')

// npx hardhat run scripts/deployProposalVotingContract.js --network mumbai
async function main () {
  try {
    const TokenWeightedVoting = await hardhat.ethers.getContractFactory(
      'TokenWeightedVoting'
    )

    // MOC token address
    // const mocTokenAddress = '0x878120A5C9828759A250156c66D629219F07C5c6'
    const mocTokenAddress = '0x6F6bB5dADDB05718382A0192B65603492C939f8F' // Sepolia testnet USDC address for testing
    const admins = [
      '0x264f0700c60690a0e38ffc0702a64fdaf3251b25', // CL
      '0x39c8e6291e73c1f76888c01439151529478f78c0', // LL
      '0x28a7d59e1fe2293df533f6f13d1298a7e45f58b5',
      '0x8f44464be1197041ed9df2d5623c078f609dad6e',
      '0x65d400b266fe59ea6bbc31d5888b3029b97999c1'
    ]

    // Start deployment, passing the MOC token address to the constructor
    const deployedContract = await TokenWeightedVoting.deploy(mocTokenAddress, admins)

    console.log(
      `TokenWeightedVoting contract deployed to address: ${deployedContract.address}`
    )
  } catch (err) {
    console.log('error', `Error deploying TokenWeightedVoting contract: ${err}`)
  }
}

main()
