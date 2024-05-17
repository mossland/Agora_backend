const Users = require('../../models/users.model')

module.exports.banUser = async function (req, res) {
  try {
    
    const userId = req.params.uid

    if (req.body.banReason === undefined || req.body.banReason.trim() === '') {
      return res.status(404).send('Ban reason is required')
    }

    const usertoupdate = await Users.findOne({ _id: userId })

    if (!usertoupdate || usertoupdate.role === 'Admin') {
      return res.status(400).send(`Failed to ban user ${userId}`)
    }

    const banUser = async () => {
      usertoupdate.isBanned = true
      usertoupdate.banReason = req.body.banReason
      usertoupdate.banTimestamp = new Date()

      usertoupdate
        .save()
        .then((usertoupdate) => {
          return res.status(200).json({ _id: usertoupdate._id })
        })
        .catch((err) => {
          console.log('error', `Failed to ban user: ${err}`)
          return res.status(400).send(`Failed to ban user ${userId}`)
        })
    }

    async function handleBanUser () {
      try {
        banUser()
      } catch (err) {
        console.log('error', `Failed to ban user: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleBanUser()
  } catch (e) {
    return res.status(400).send('Failed to ban user')
  }
}
