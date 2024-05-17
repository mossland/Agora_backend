const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ForumCategories = require('./forumcategories.model')
const Users = require('./users.model')

const Forums = new Schema({
  title: {
    type: String
  },
  contents: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: Users
  },
  category: {
    type: String,
    ref: ForumCategories
  },
  createdAt: {
    type: Date
  },
  pinned: {
    type: Boolean
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
  },
  views: {
    type: Number
  }
})

module.exports = mongoose.model('Forums', Forums)
