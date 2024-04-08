const AWS = require('aws-sdk')

AWS.config.update({ region: 'us-west-2' })

const getSeedPhrase = async () => {
  const secretsManager = new AWS.SecretsManager()
  const secret = await secretsManager
    .getSecretValue({ SecretId: 'mossland-wallet' })
    .promise()
  return secret.SecretString
}

module.exports.getPrivateKey = async function () {
  const PRIVATE_KEY = await getSeedPhrase()
  return PRIVATE_KEY
}
