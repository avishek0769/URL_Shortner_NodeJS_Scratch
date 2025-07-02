import { createShortUrl } from "../controllers/url.controller";


const routes = [
    { method: "GET", route: "/", middlewares: [], controller: handleHomePage},
    { method: "POST", route: "/create", middlewares: [bodyParser], controller: createShortUrl},
]

export function urlRouter (req, res, initialRoute = "") {
    
}
