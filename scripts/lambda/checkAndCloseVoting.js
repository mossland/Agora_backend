const { ethers } = require('ethers')

exports.handler = async (event) => {
  const provider = new ethers.providers.JsonRpcProvider('YOUR_INFURA_OR_ALCHEMY_URL')
  const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider)

  const contractAddress = 'YOUR_CONTRACT_ADDRESS'
  const contractABI = [
    // ... Contract ABI ...
  ]

  const contract = new ethers.Contract(contractAddress, contractABI, wallet)

  async function checkAndCloseVoting () {
    const proposalCount = await contract.proposalCount()
    for (let proposalId = 1; proposalId <= proposalCount; proposalId++) {
      const proposal = await contract.proposals(proposalId)
      if (!proposal.closed && (Date.now() / 1000) >= proposal.endDate) {
        const tx = await contract.closeVoting(proposalId)
        await tx.wait()
        console.log(`Closed voting for proposal ${proposalId}`)
      }
    }
  }

  await checkAndCloseVoting()
}
