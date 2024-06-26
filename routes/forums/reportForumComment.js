const Comments = require('../../models/forumcomments.model')

module.exports.reportForumComment = async function (req, res) {
  try {
    const commentId = req.params.cid

    if (req.body.reportReason === undefined || req.body.reporter === undefined || req.body.reportReason.trim() === '') {
      return res.status(404).send('Report reason is required')
    }

    if (req.user.user_id !== req.body.reporter) {
      return res.status(400).send('Failed to report comment')
    }

    const commentToUpdate = await Comments.findOne({ _id: commentId })

    if (!commentToUpdate) {
      return res.status(400).send(`Failed to report comment ${commentId}`)
    }

    const reportComment = async () => {
      commentToUpdate.reported = true
      commentToUpdate.reportReason = req.body.reportReason
      commentToUpdate.reportedTimestamp = new Date()
      commentToUpdate.reporter = req.body.reporter

      commentToUpdate
        .save()
        .then((commentToUpdate) => {
          return res.status(200).json({ _id: commentToUpdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to report comment: ${err}`)
          return res.status(400).send(`Failed to report comment ${commentId}`)
        })
    }

    async function handleReportComment () {
      try {
        reportComment()
      } catch (err) {
        console.log('error', `Failed to report comment ${commentId}`)
        return res.status(400).send(err)
      }
    }
    handleReportComment()
  } catch (e) {
    return res.status(400).send('Failed to report comment')
  }
}
