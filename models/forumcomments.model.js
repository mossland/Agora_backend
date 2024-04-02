const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const Users = require('./users.model')
const Forums = require('./forums.model')

const Comments = new Schema({
  _id: {
    type: ObjectId
  },
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
  reportReason: {
    type: String
  },
  flaggedForDeletion: {
    type: Boolean
  }
})

module.exports = mongoose.model('Comments', Comments)
