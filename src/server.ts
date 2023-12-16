import express from 'express'
import plantas from './routes/plantas'
import promo from './routes/promo'
import oauth from './routes/oauth'
import { PrismaClient } from '@prisma/client'
import newsLetter from './routes/newsletter'

export const prisma = new PrismaClient()

const cors = require('cors')
const app = express()

app.use(cors())

app.use(express.json({ limit: '50mb' }));

app.use('/api', plantas)

app.use('/api', promo)

app.use('/api', newsLetter)

app.use('/api', oauth)


app.listen(3000, () => {
  console.log('Servidor rodando em http://localhost:3000/api')
})