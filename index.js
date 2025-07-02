import http from "http"
import { userRouter } from "./routes/user.route.js";
import mongoose from "mongoose";

const server = http.createServer((req, res) => {
    if (req.url == "/favicon.co") res.end();

    userRouter(req, res, "/users")
})

server.listen(3000, () => {
    console.log("Server running on 3000...")
    mongoose.connect("mongodb://127.0.0.1:27017/url_shortner?directConnection=true")
        .then(_ => console.log("MongoDB Connected !!"))
})