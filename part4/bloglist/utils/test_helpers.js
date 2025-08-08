const jwt = require('jsonwebtoken')
const User = require('../models/user')

const getTokenForTestUser = async () => {
  const user = await User.findOne({ username: 'root' })
  if (!user) {
    throw new Error('Test user not found')
  }

  const userForToken = {
    username: user.username,
    id: user._id.toString(),
  }

  return jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' })
}

module.exports = {
  getTokenForTestUser,
}
