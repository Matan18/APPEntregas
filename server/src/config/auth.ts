export default {
  jwt: {
    secret: process.env.JWT_TOKEN || 'default',
    expiresIn: '1d'
  }
}
