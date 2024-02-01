import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import AuthRoute from './routes/auth.js'
import ScoreRoute from './routes/score.js'
import UserRoute from './routes/users.js'
import GameRoute from './routes/game.js'
const app = express()

dotenv.config()
const port = process.env.PORT
const connectDatabase = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to database")
    } catch (error) {
        throw (error)
    }
};
mongoose.connection.once('disconnected', () => {
    console.log("mongoDB disconnected")
})
mongoose.connection.on("connected", () => {
    console.log("mongoDB connected")
})

//middlewares 
app.use(express.json());
app.use("/api/auth", AuthRoute)
app.use("/api/score", ScoreRoute)
app.use("/api/users", UserRoute)
app.use("/api/game", GameRoute);



app.listen(port, () => { 
    connectDatabase();
    console.log("server running at", port)
})
