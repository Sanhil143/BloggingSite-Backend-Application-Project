const express = require("express")
const mongoose = require("mongoose")
const dotenv = require('dotenv')
const route = require("./routes/route")
mongoose.set('strictQuery', true)
const app = express()


app.use(express.json())

dotenv.config()

mongoose.connect(process.env.YOUR_DATABASE_URL)
      .then(() => console.error("My DB is connected"))
      .catch((err) => console.error(err))


app.use("/", route)

app.listen(process.env.PORT, () => {
      console.error("Express app running on port " + process.env.PORT);
})





