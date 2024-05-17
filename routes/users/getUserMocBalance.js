const axios = require('axios')

module.exports.getUserMocBalance = async function (req, res) {
  try {
    const walletAddress = req.params.wid

    const response = await axios.post(
      'https://web3.nodit.io/v1/luniverse/mainnet/token/getTokensOwnedByAccount',
      {
        accountAddress: walletAddress,
        // accountAddress: '0x288cbc697ed2d3cfb2cc42310021ccf6519a76f4',
        contractAddresses: [
          '0x878120A5C9828759A250156c66D629219F07C5c6'
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-API-KEY': process.env.VITE_APP_LUNIVERSE_API_KEY
        }
      }
    )

    return res.json(response.data)
  } catch (err) {
    console.log(err)
    return res.status(400).send('Failed to GET user MOC balance')
  }
}
