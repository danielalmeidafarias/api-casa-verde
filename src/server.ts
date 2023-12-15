import express from 'express'
import plantas from './routes/plantas'
import promo from './routes/promo'
import oauth from './routes/oauth'
const cors = require('cors')

const app = express()
app.use(cors({
  cors: `http://localhost:3000`,

}))

app.use('/api', plantas)

app.use('/api', promo)

app.use('/api', oauth)


app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000/api')
})