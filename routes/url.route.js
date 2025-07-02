import { createShortUrl, handleHomePage, handleShortUrlClick } from "../controllers/url.controller.js";
import { auth } from "../middlewares/auth.js";
import { bodyParser } from "../middlewares/bodyParser.js"
import { requestPipeline } from "../requestPipeline.js"

const routes = [
    // Get from api too
    { method: "GET", route: "", middlewares: [auth], controller: handleHomePage },
    { method: "POST", route: "/api/create", middlewares: [auth, bodyParser], controller: createShortUrl },
]

export function urlRouter(req, res, initialRoute = "") {
    const urlShortId = req.url.split("url")[1]

    if (!urlShortId.startsWith("/api") && req.url != "/url") {
        req.shortId = urlShortId.slice(1)
        handleShortUrlClick(req, res)
    }
    else {
        requestPipeline(req, res, initialRoute, routes, {})
    }
}
