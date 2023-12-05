import express from 'express'
import { Request, Response } from 'express'
import plantas from './routes/plantas'
import promo from './routes/promo'


const app = express()

app.use('/api', plantas)

app.use('/api', promo)


app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000/api')
})