const Users = require('../../models/users.model')

module.exports.revokeUserBan = async function (req, res) {
  
  const userId = req.params.uid

  const usertoupdate = await Users.findOne({ _id: userId })

  if (!usertoupdate) {
    return res.status(400).send(`Failed to revoke user ban ${req.params.uid}`)
  }

  const revokeUserBan = async () => {
    usertoupdate.isBanned = false
    usertoupdate.banReason = undefined
    usertoupdate.banTimestamp = undefined

    usertoupdate
      .save()
      .then((usertoupdate) => {
        return res.status(200).json({ _id: usertoupdate._id })
      })
      .catch((err) => {
        console.log('error', `Failed to revoke user ban: ${err}`)
        return res
          .status(400)
          .send(`Failed to revoke user ban ${req.params.uid}`)
      })
  }

  async function handleRevokeUserBan () {
    try {
      revokeUserBan()
    } catch (err) {
      console.log('error', `Failed to revoke user ban: ${err}`)
      return res.status(400).send(err)
    }
  }
  handleRevokeUserBan()
}
