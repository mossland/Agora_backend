const Users = require('../../models/users.model')
const Proposals = require('../../models/proposals.model')

module.exports.postProposal = async function (req, res) {
  try {
    const userPermissions = req.resourceList

    if (
      req.body.title === undefined ||
      req.body.description === undefined ||
      req.body.proponent === undefined ||
      req.body.tag === undefined ||
      req.body.startDate === undefined ||
      req.body.endDate === undefined ||
      req.body.ccdAdmins === undefined
    ) {
      return res.status(404).send('Missing proposal data')
    }

    const proponent = await Users.findOne({ _id: req.body.proponent })

    if (!proponent) {
      return res.status(400).send('Failed to post proposal')
    }

    const now = new Date()
    const newProposal = async () => {
      const proposal = new Proposals({
        title: req.body.title,
        createdAt: now,
        status: 'In Review',
        description: req.body.description,
        proponent: req.body.proponent,
        tag: req.body.tag,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        extended: false,
        ccdAdmins: req.body.ccdAdmins,
        likers: [],
        views: 0
      })

      proposal
        .save()
        .then((proposal) => {
          return res.status(201).json({ _id: proposal._id })
        })
        .catch((err) => {
          return res.status(400).send(`Failed to post proposal: ${err}`)
        })
    }

    async function handleNewProposal () {
      try {
        newProposal()
      } catch (err) {
        console.log('error', `Failed to post proposal: ${err}`)
        return res.status(400).send(err)
      }
    }
    handleNewProposal()
  } catch (e) {
    return res.status(400).send('Failed to post proposal')
  }
}
