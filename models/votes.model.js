const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Users = require('./users.model')
const Proposals = require('./proposals.model')

const Votes = new Schema({
  associatedProposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Proposals
  },
  createdAt: {
    type: Date
  },
  type: {
    type: String
  },
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users
  },
  voterWalletAddress: {
    type: String
  },
  initialMocBalance: {
    type: Number
  },
  mocBalanceAtClose: {
    type: Number
  }
})

module.exports = mongoose.model('Votes', Votes)
