const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ProposalTags = new Schema({
  _id: {
    type: String
  },
  slug: {
    type: String
  }
})

module.exports = mongoose.model('ProposalTags', ProposalTags)
