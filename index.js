import express from "express"
import dotenv from "dotenv"
import mongoose from "mongoose"
import cors from "cors"
import cookieParser from "cookie-parser"
import bodyParser from "body-parser"
import AuthRoute from './routes/auth.js'
import ScoreRoute from './routes/score.js'
import UserRoute from './routes/users.js'
import GameRoute from './routes/game.js'
const app = express()

dotenv.config()
const port = process.env.PORT

const corsOptions = {
    origin: true,
    Credentials: true,
}
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
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:8080', 'https://kotana-api.onrender.com'); // Update this with your frontend URL
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', 'true'); // Set the header to allow credentials
    next();
});

app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api/auth", AuthRoute)
app.use("/api/score", ScoreRoute)
app.use("/api/user", UserRoute)
app.use("/api/game", GameRoute);



app.listen(port, () => {
    connectDatabase();
    console.log("server running at", port)
})
