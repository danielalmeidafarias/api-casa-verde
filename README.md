# Api projeto Casa Verde e-commerce
* front-end: https://github.com/danielalmeidafarias/casa-verde
  
## Ambiente de Desenvolvimento
* npm install && npx prisma migrate dev && npm run dev
## Build
* npm run build
  
## .ENV
DATABASE_URL=''
EMAIL = 'email@outlook.com'
PASSWORD = 'password'
ADMIN_EMAIL = ['']
STRIPE_KEY = ""
WEBHOOKS_KEY = ""

## /api
### GET /plantas
### GET /plantas/:id
* req.params.id
### GET /promo
### POST /newsletter
* req.body.email
### DELETE /newsletter
* req.body.email
### POST /auth
* req.body.credential
### DELETE /auth
* req.body.id
### GET /userinfo/:userid
* req.params.userid
### POST /payment
* req.body.cart: TCART
* req.body.userId
### GET /pedidos/:userId
* req.params.userId
### PUT /pedidos/:userId/cancel
* req.body.session_id
### PUT /pedidos/:userId/refound
* req.body.payment_intent

## /admin
### GET /newsletter/send
* req.query.adminId
### POST /newsletter/send
* req.body.adminId
* req.body.subject
* req.body?.text
* req.body?.html
### GET /plantas
* req.query.adminId
### POST /plantas
* req.body.adminId
* req.body.planta
### DELETE /plantas
* req.query.adminId
* req.query.id
### PUT /plantas
* req.query.adminId
* req.query.id
* req.body.plantaAtualizada: Planta
### GET /users
* req.query.adminId
