const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Users = new Schema({
  role: {
    type: String
  },
  token: {
    type: String
  },
  walletAddress: {
    type: String
  },
  isBanned: {
    type: Boolean
  },
  banReason: {
    type: String
  },
  banTimestamp: {
    type: Date
  },
  nickname: {
    type: String
  },
  profilePicture: {
    type: String
  },
  createdAt: {
    type: Date
  },
  lastSeen: {
    type: Date
  },
  firstVote: {
    type: Date
  },
  views: {
    type: Number
  }
})

module.exports = mongoose.model('Users', Users)
