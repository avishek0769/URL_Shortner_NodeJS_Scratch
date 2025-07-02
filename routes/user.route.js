import { createUser, handleSignupPage, loginUser, handleLoginPage } from "../controllers/user.controller.js";
import { bodyParser } from "../middlewares/bodyParser.js";


const routes = [
    { method: "GET", route: "/signup", middlewares: [], controller: handleSignupPage},
    { method: "GET", route: "/login", middlewares: [], controller: handleLoginPage},
    { method: "POST", route: "/signup", middlewares: [bodyParser], controller: createUser},
    { method: "POST", route: "/login", middlewares: [bodyParser], controller: loginUser},
]

export function userRouter (req, res, initialRoute = "") {
    for (const elem of routes) {
        if(elem.method == req.method && (initialRoute + elem.route) == req.url){
            let i = 0
            let extraArgs = { url: req.url }
            function next () {
                if(i < elem.middlewares.length){
                    if(res.writableEnded) return;
                    else {
                        elem.middlewares[i++](req, res, next, extraArgs);
                    }
                }
                else {
                    elem.controller(req, res)
                }
            }
            next()
        }
    }
}
