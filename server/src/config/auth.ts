export default {
  jwt: {
    secret: process.env.JWT_TOKEN,
    expiresIn: '1d'
  }
}
