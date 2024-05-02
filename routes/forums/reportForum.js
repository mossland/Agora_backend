const Forums = require('../../models/forums.model')

module.exports.reportForum = async function (req, res) {
  try {
    const userPermissions = req.resourceList
    const forumId = req.params.fid

    if (req.body.reportReason === undefined || req.body.reportReason.trim() === '') {
      return res.status(404).send('Report reason is required')
    }

    const forumToUpdate = await Forums.findOne({ _id: forumId })

    if (!forumToUpdate) {
      return res.status(400).send(`Failed to report forum ${forumId}`)
    }

    const reportForum = async () => {
      forumToUpdate.reported = true
      forumToUpdate.reportReason = req.body.reportReason
      forumToUpdate.reportedTimestamp = new Date()

      forumToUpdate
        .save()
        .then((forumToUpdate) => {
          return res.status(200).json({ _id: forumToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to report forum: ${err}`)
          return res.status(400).send(`Failed to report forum ${forumId}`)
        })
    }

    async function handleReportForum () {
      try {
        reportForum()
      } catch (err) {
        console.log('error', `Failed to report forum ${forumId}`)
        return res.status(400).send(err)
      }
    }
    handleReportForum()
  } catch (e) {
    return res.status(400).send('Failed to report forum')
  }
}
