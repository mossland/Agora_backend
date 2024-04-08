const { ObjectId } = require('mongodb')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ForumCategories = require('./forumcategories.model')
const Users = require('./users.model')

const Forums = new Schema({
  _id: {
    type: ObjectId
  },
  title: {
    type: String
  },
  slug: {
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
  reportReason: {
    type: String
  },
  flaggedForDeletion: {
    type: Boolean
  },
  likes: {
    type: Number
  },
  likers: {
    type: [String]
  },
  views: {
    type: Number
  }
})

module.exports = mongoose.model('Forums', Forums)
