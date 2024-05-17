const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Users = require('./users.model')
const Forums = require('./forums.model')

const Comments = new Schema({
  forumTopic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Forums
  },
  createdAt: {
    type: Date
  },
  contents: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users
  },
  reported: {
    type: Boolean
  },
  reportedTimestamp: {
    type: Date
  },
  reporter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users
  },
  reportReason: {
    type: String
  },
  flaggedForDeletion: {
    type: Boolean
  },
  likers: {
    type: [String]
  }
})

module.exports = mongoose.model('Comments', Comments)
