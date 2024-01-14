const app = require('./app')
const config = require('./utils/config')
const { info } = require('./utils/logger')

const PORT = 3003
app.listen(config.PORT, () => {
  info(`Server running on port ${PORT}`)
})