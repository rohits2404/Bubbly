import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";

import { connectDB } from "./config/db";

import authRoutes from "./routes/auth.route";
import { initializeSocket } from "./socket/socket";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req,res) => {
    res.send("API Is Working!")
})

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);

initializeSocket(server);

connectDB().then(() => {
    server.listen(PORT, () => {
        console.log("Server Started On PORT:", PORT)
    })
}).catch((error) => {
    console.log("Failed To Start Server Due To MongoDB Connection Failure");
    console.log(error)
})