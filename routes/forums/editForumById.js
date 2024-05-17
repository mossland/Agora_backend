const Forums = require('../../models/forums.model')

module.exports.editForumById = async function (req, res) {
  try {
    const forumId = req.params.fid

    if (req.body.title === undefined || req.body.title.trim() === '' || req.body.contents === undefined) {
      return res.status(404).send('Forum topic title and contents are required')
    }

    const forumToUpdate = await Forums.findOne({ _id: forumId })

    if (!forumToUpdate) {
      return res.status(400).send(`Failed to update forum topic ${forumId}`)
    }

    const updateForum = async () => {
      forumToUpdate.title = req.body.title
      forumToUpdate.contents = req.body.contents

      forumToUpdate
        .save()
        .then((forumToUpdate) => {
          return res.status(200).json({ _id: forumToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to update forum topic: ${err}`)
          return res.status(400).send(`Failed to update forum topic ${forumId}`)
        })
    }

    async function handleUpdateForm () {
      try {
        updateForum()
      } catch (err) {
        console.log('error', `Failed to update forum topic: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleUpdateForm()
  } catch (e) {
    return res.status(400).send('Failed to update forum topic')
  }
}
