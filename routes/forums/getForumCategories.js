const ForumCategories = require('../../models/forumcategories.model')

module.exports.getForumCategories = async function (req, res) {
  try {
    const forumCategories = await ForumCategories.find()
    return res.json(forumCategories)
  } catch (err) {
    return res.status(400).send('Failed to GET forum categories')
  }
}
