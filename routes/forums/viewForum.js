const Forums = require('../../models/forums.model')

module.exports.viewForum = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const forumId = req.params.fid

    const forumToUpdate = await Forums.findOne({ _id: forumId })

    if (!forumToUpdate) {
      return res.status(400).send('Failed to view forum')
    }

    // Users can view a forum multiple times

    const viewForum = async () => {
      forumToUpdate.views = forumToUpdate.views + 1

      forumToUpdate
        .save()
        .then((forumToUpdate) => {
          return res.status(200).json({ _id: forumToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to view forum: ${err}`)
          return res.status(400).send(`Failed to view forum ${forumId}`)
        })
    }

    async function handleViewProposal () {
      try {
        viewForum()
      } catch (err) {
        console.log('error', `Failed to view forum: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleViewProposal()
  } catch (e) {
    return res.status(400).send('Failed to view forum')
  }
}
