const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProposalTags = require('./proposaltags.model')
const Users = require('./users.model')
const Forums = require('./forums.model')

const Proposals = new Schema({
  title: {
    type: String
  },
  status: {
    type: String
  },
  reviewReason: {
    type: String
  },
  description: {
    type: String
  },
  proponent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users
  },
  tag: {
    type: String,
    ref: ProposalTags
  },
  createdAt: {
    type: Date
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  extended: {
    type: Boolean
  },
  extendedEndDate: {
    type: Date
  },
  reviewTimestamp: {
    type: Date
  },
  linkedDiscusion: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Forums
  },
  ccdAdmins: {
    type: [String]
  },
  likers: {
    type: [String]
  },
  views: {
    type: Number
  }
})

module.exports = mongoose.model('Proposals', Proposals)
