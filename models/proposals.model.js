const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProposalTags = require('./proposaltags.model')
const Users = require('./users.model')

const Proposals = new Schema({
  _id: {
    type: ObjectId
  },
  title: {
    type: String
  },
  slug: {
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
  reviewTimestamp: {
    type: Date
  }
  // votes
  // cc'd admins
})

module.exports = mongoose.model('Proposals', Proposals)
