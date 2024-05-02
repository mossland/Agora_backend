require('dotenv').config({ path: '../../config.env' })
const Users = require('../../models/users.model')
const jwt = require('jsonwebtoken')

module.exports.login = async function (req, res) {
  // POST user login
  try {
    const { signature } = req.body

    // Validate user input
    if (!(signature)) {
      return res.status(400).send('Failed to authorize user login.')
    }

    const signingAddress = ''

    // const web3 = new Web3(process.env.ALCHEMY_API_URL_ETH_TEST) // to-do: update to luniverse node

    // const signingAddress = web3.eth.accounts.recover(
    //   process.env.SIGNING_MESSAGE,
    //   req.body.signature
    // )

    // Validate if user exists in database
    const user = await Users.findOne({ walletAddress: signature })
    if (!user) {
      return res.status(400).send('Failed to authorize user login.')
    }

    if (
      user &&
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
