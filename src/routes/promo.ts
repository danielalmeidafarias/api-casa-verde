import express, { Router, Request, Response } from 'express'
import { PrismaClient } from '@prisma/client'

const promo = Router()
const prisma = new PrismaClient()

promo.use(express.json())

promo.route('/promo')
.get(async(req: Request, res: Response) => {
    
  const promoPlantas = await prisma.planta.findMany({
    where: {
      onSale: true
    }
  })

  res.json(promoPlantas)
})

export default promo