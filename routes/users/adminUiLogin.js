require('dotenv').config({ path: '../../config.env' })
const Users = require('../../models/users.model')
const jwt = require('jsonwebtoken')
const Web3 = require('web3')

module.exports.adminUiLogin = async function (req, res) {
  // POST user login
  try {
    const { signature, wallet } = req.body

    // Validate user input
    if (!(signature && wallet)) {
      return res.status(400).send('Failed to authorize user login.')
    }

    const web3 = new Web3('https://luniverse-mainnet.nodit.io/Ff9orLVj~8u4mTJts1LWNySL7QdihDFe')

    const signingAddress = web3.eth.accounts.recover(
      process.env.SIGNING_MESSAGE,
      req.body.signature
    )

    if (signingAddress.toLowerCase() !== req.body.wallet.toLowerCase()) {
      return res.status(400).send('Failed to authorize user login.')
    }

    // Validate if user exists in database
    const user = await Users.findOne({ walletAddress: wallet.toLowerCase() })
    if (!user) {
      return res.status(400).send('Failed to authorize user login.')
    }

    if (
      user &&
      user.role === 'Admin' &&
      user.isBanned === false
    ) {
      // Create token
      const token = jwt.sign(
        { user_id: user._id, role: user.role, wallet: user.walletAddress },
        process.env.TOKEN_KEY,
        {
          expiresIn: '4h'
        }
      )

      // Save user token
      user.token = token
      user
        .save()
        .then((user) => {
          return res.status(200).send(user)
        })
        .catch((err) => {
          return res.status(400).send(`Failed to authorize user login: ${err}`)
        })
    } else {
      return res.status(400).send('Unauthorized.')
    }
  } catch (err) {
    return res.status(500)
  }
}
