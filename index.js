import express from 'express'
import 'dotenv/config'
import { PORT } from './config.js'
import userRouter from './routes/user.route.js'

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/users', userRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
