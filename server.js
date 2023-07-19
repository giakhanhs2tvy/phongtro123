import express from 'express'
require('dotenv').config()

import initRoutes from './src/routes'
import connectDatabase from './src/config/connectDatabase'
var cors = require('cors')
const app = express()
app.use(cors({
    origin :'http://localhost:3000',
    methods:['POST', 'GET', 'PUT', 'DELETE']
}))
app.use(express.json())
app.use(express.urlencoded({extended :true}))



initRoutes(app)
connectDatabase()
const port = process.env.PORT || 8888
const listener = app.listen(port, () =>{
    console.log(`Server is running on port ${listener.address().port}`)
})