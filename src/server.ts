import express from 'express'
import exitHook from 'async-exit-hook'
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb'
import { env } from '~/config/environtment'
import { APIsV1 } from './routes/v1'

const START_SERVER = () => {
  const app = express()

  app.use('/v1', APIsV1)

  app.listen(env.APP_PORT, env.APP_HOST, () => {
    console.log(`Server running at http://${env.APP_HOST}:${env.APP_PORT}/`)
  })

  exitHook(() => {
    CLOSE_DB()
  })
}

CONNECT_DB()
  .then(() => START_SERVER())
  .catch((err) => {
    console.error(err)
    process.exit(0)
  })
