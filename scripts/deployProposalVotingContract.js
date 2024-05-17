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

    // Start deployment, passing the MOC token address to the constructor
    const deployedContract = await TokenWeightedVoting.deploy(mocTokenAddress)

    console.log(
      `TokenWeightedVoting contract deployed to address: ${deployedContract.address}`
    )
  } catch (err) {
    console.log('error', `Error deploying TokenWeightedVoting contract: ${err}`)
  }
}

main()
