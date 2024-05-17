const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers')
const { expect } = require('chai')
const { ethers } = require('hardhat')

// npx hardhat test --network hardhat
describe('TokenWeightedVoting Contract', function () {
  const startDate = Math.floor(Date.now() / 1000) - (5 * 24 * 60 * 60) // 5 days ago
  const endDate = Math.floor(Date.now() / 1000) + (2 * 24 * 60 * 60) // 2 days from now

  async function deployTokenFixture () {
    const MockERC20Token = await ethers.getContractFactory('MockERC20Token')
    const mockToken = await MockERC20Token.deploy('testMOC', 'MOC', 9000000000000) // Deploy the mock ERC20 token contract
    await mockToken.deployed()

    const TokenWeightedVoting = await ethers.getContractFactory('TokenWeightedVoting')
    const [owner, addr1, addr2] = await ethers.getSigners()

    const hardhatToken = await TokenWeightedVoting.deploy(mockToken.address) // Pass the address of the deployed mock ERC20 token contract
    await hardhatToken.deployed()

    // Mint some tokens to the owner address for testing purposes
    // await mockToken.transfer(owner.address, ethers.utils.parseEther("1"));

    return { TokenWeightedVoting, hardhatToken, mockToken, owner, addr1, addr2 }
  }

  it('Test create new proposal', async function () {
    const { hardhatToken, mockToken, owner } = await loadFixture(deployTokenFixture)

    // Set initial balances for testing
    // await mockToken.transfer(owner.address, ethers.utils.parseEther('100')) // Transfer tokens to the owner for testing

    // Create new proposal
    await hardhatToken.createProposal(startDate, endDate, '123abc')

    // Check if the proposal was created successfully
    const proposal = await hardhatToken.proposals(1)
    expect(proposal.startDate).to.equal(startDate)
    expect(proposal.endDate).to.equal(endDate)
    expect(proposal.closed).to.equal(false)
    expect(proposal.proponent).to.equal(owner.address)

    // Cast a vote
    await hardhatToken.vote(1, 0) // Voting for the proposal

    // Check if the vote was cast successfully
    const voter = await hardhatToken.getVoteHistory(1, owner.address)
    expect(voter.voterAddress).to.equal(owner.address)
    expect(voter.vote).to.equal(0) // Vote for the proposal

    // Wait for the end date of the proposal
    await ethers.provider.send('evm_increaseTime', [8 * 24 * 60 * 60]) // Move time forward 8 days
    await ethers.provider.send('evm_mine', []) // Mine a new block to make the time increase effective

    // Closing voting
    await hardhatToken.closeVoting(1)

    // Check if the voting is closed and emit event
    const closedProposal = await hardhatToken.proposals(1)
    expect(closedProposal.closed).to.equal(true)

    const result = await hardhatToken.getResult(1)
    // Assert the result based on your expectation
    // Print the result
    console.log("Result:", result);
  })
})
