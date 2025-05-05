import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/db.js";
import userRoute from "./routes/userRoutes.js";
import postRoute from "./routes/postRoutes.js"
import messageRoute from "./routes/messageRoutes.js"

dotenv.config()

const app = express();

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    return res.status(200).json({
        message: "Hello From Backend",
        success: true,
    })
})

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
}
app.use(cors(corsOptions));

// APIs
app.use("/api/v1/user", userRoute); // "http://localhost/api/v1/user/register"
app.use("/api/v1/post", postRoute); // "http://localhost/api/v1/post/addpost"
app.use("/api/v1/message", messageRoute); // "http://localhost/api/v1/message/all"

app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on http://localhost:${PORT}`);
})