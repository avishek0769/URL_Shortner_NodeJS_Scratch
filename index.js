import http from "http"
import { userRouter } from "./routes/user.route.js";

const server = http.createServer((req, res) => {
    if(req.url == "/favicon.co") res.end();
    
    userRouter(req, res, "/users")
})

server.listen(3000, () => console.log("Server running on 3000..."))