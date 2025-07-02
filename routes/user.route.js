import { createUser, handleSignupPage, loginUser, handleLoginPage } from "../controllers/user.controller.js";
import { bodyParser } from "../middlewares/bodyParser.js";
import { requestPipeline } from "../requestPipeline.js";


export function userRouter(req, res, initialRoute = "") {
    // Due to closures
    const routes = [
        // Get from api too
        { method: "GET", route: "/signup", middlewares: [], controller: handleSignupPage },
        { method: "GET", route: "/login", middlewares: [], controller: handleLoginPage },
        { method: "POST", route: "/api/signup", middlewares: [bodyParser], controller: createUser },
        { method: "POST", route: "/api/login", middlewares: [bodyParser], controller: loginUser },
    ]
    requestPipeline(req, res, initialRoute, routes, { url: req.url })
}
