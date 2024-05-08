const Users = require('../../models/users.model')
const Web3 = require('web3')

module.exports.register = async function (req, res) {
  // POST user registration
  try {
    // Get user input
    const nickname = req.body.nickname
    const pfp = req.body.pfp
    const wallet = req.body.wallet
    const signature = req.body.signature

    if (
      !(nickname && pfp && wallet && signature)
    ) {
      res.status(400).send('Missing required input.')
    }

    const web3 = new Web3('https://luniverse-mainnet.nodit.io/Ff9orLVj~8u4mTJts1LWNySL7QdihDFe')

    const signingAddress = web3.eth.accounts.recover(
      process.env.SIGNING_MESSAGE,
      signature
    )

    if (signingAddress.toLowerCase() !== req.body.wallet.toLowerCase()) {
      return res.status(400).send('Failed to authorize user login.')
    }

    // Validate if user exists in database
    const existingUser = await Users.findOne({ walletAddress: signingAddress.toLowerCase() })
    if (existingUser) {
      return res
        .status(409)
        .send('A user with this credential already exists. Please login.')
    }

    // Create user in database
    const now = new Date()
    const user = new Users({
      role: 'Contributor',
      walletAddress: wallet.toLowerCase(),
      isBanned: false,
      nickname,
      profilePicture: pfp,
      createdAt: now,
      lastSeen: now,
      views: 0
    })

    user
      .save()
      .then((user) => {
        return res.status(201).json({
          _id: user._id
        })
      })
      .catch((err) => {
        return res.status(400).send(`Failed to register new user: ${err}`)
      })
  } catch (err) {
    return res.status(500)
  }
}
