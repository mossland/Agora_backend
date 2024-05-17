const Proposals = require('../../models/proposals.model')
const { ethers } = require('ethers')

module.exports.closeProposalVoting = async function (req, res) {
  try {
    const proposalId = req.params.pid

    const proposalToUpdate = await Proposals.findOne({ _id: proposalId })

    if (!proposalToUpdate) {
      return res.status(400).send('Failed to patch proposal')
    }

    const now = new Date()

    if (now < proposalToUpdate.endDate) {
      return res.status(400).send('Proposal voting is still ongoing - too early to close voting')
    }

    if (proposalToUpdate.votingClosed) {
      return res.status(400).send('Proposal voting has already been closed')
    }

    if (proposalToUpdate.smartContractId === null || proposalToUpdate.smartContractId === undefined) {
      return res.status(400).send('Proposal smart contract ID has not been set')
    }

    const provider = new ethers.providers.JsonRpcProvider(process.env.SEPOLIA_NODE_URL)
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider)

    const contractAddress = process.env.VOTING_CONTRACT
    const contractABI = abi
    const contract = new ethers.Contract(contractAddress, contractABI, wallet)

    async function checkAndCloseVoting () {
      const proposal = await contract.proposals(proposalToUpdate.smartContractId)
      if (!proposal.closed && (Date.now() / 1000) >= proposal.endDate) {
        const tx = await contract.closeVoting(proposalId)
        await tx.wait()
        console.log(`Closed voting for proposal ${proposalId}`)
      }

      proposalToUpdate.votingClosed = true

      proposalToUpdate
        .save()
        .then((proposalToUpdate) => {
          return res.status(200).json({ _id: proposalToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to close proposal voting - DB patch: ${err}`)
          return res.status(400).send(`Failed to close proposal voting - DB patch: ${proposalId}`)
        })
    }

    await checkAndCloseVoting()
  } catch (e) {
    return res.status(400).send('Failed to patch proposal')
  }
}

const abi =
[
  {
    inputs: [
      {
        internalType: 'address',
        name: '_mocToken',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'string',
        name: 'proposalIdMongo',
        type: 'string'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'startDate',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'endDate',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'proponent',
        type: 'address'
      }
    ],
    name: 'ProposalCreated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'address',
        name: 'voter',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'enum TokenWeightedVoting.Vote',
        name: 'vote',
        type: 'uint8'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'mocBalanceAtVoteTime',
        type: 'uint256'
      }
    ],
    name: 'VoteCast',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'VotingClosed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        indexed: false,
        internalType: 'int256',
        name: 'result',
        type: 'int256'
      }
    ],
    name: 'VotingResult',
    type: 'event'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'abstainVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'againstVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'calculatePredictedResult',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'closeVoting',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_startDate',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: '_endDate',
        type: 'uint256'
      },
      {
        internalType: 'string',
        name: 'proposalIdMongo',
        type: 'string'
      }
    ],
    name: 'createProposal',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'forVotes',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      }
    ],
    name: 'getResult',
    outputs: [
      {
        internalType: 'int256',
        name: '',
        type: 'int256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'voterAddress',
        type: 'address'
      }
    ],
    name: 'getVoteHistory',
    outputs: [
      {
        components: [
          {
            internalType: 'address',
            name: 'voterAddress',
            type: 'address'
          },
          {
            internalType: 'enum TokenWeightedVoting.Vote',
            name: 'vote',
            type: 'uint8'
          },
          {
            internalType: 'uint256',
            name: 'mocBalanceAtVoteTime',
            type: 'uint256'
          },
          {
            internalType: 'uint256',
            name: 'mocBalanceAtVoteClose',
            type: 'uint256'
          }
        ],
        internalType: 'struct TokenWeightedVoting.Voter',
        name: '',
        type: 'tuple'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'mocToken',
    outputs: [
      {
        internalType: 'contract ERC20',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'proposalCount',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'proposals',
    outputs: [
      {
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'startDate',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'endDate',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'closed',
        type: 'bool'
      },
      {
        internalType: 'address',
        name: 'proponent',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'proposalId',
        type: 'uint256'
      },
      {
        internalType: 'enum TokenWeightedVoting.Vote',
        name: 'votee',
        type: 'uint8'
      }
    ],
    name: 'vote',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  }
]
