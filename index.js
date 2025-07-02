import http from "http"
import mongoose from "mongoose";
import { userRouter } from "./routes/user.route.js";
import { urlRouter } from "./routes/url.route.js";

const server = http.createServer((req, res) => {
    if (req.url == "/favicon.co") res.end();
    else if(req.url.startsWith("/users")) userRouter(req, res, "/users");
    else if(req.url.startsWith("/url")) urlRouter(req, res, "/url");
})

server.listen(3000, () => {
    console.log("Server running on 3000...")
    mongoose.connect("mongodb://127.0.0.1:27017/url_shortner?directConnection=true")
        .then(_ => console.log("MongoDB Connected !!"))
})