import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
    const token = req.headers['cookie']
    if(!token) {
        req.user = null
        return next()
    }
    let parsedCookieObject = {}

    token.split("&").forEach(pair => {
        const splitedValue = pair.split("=")
        const key = splitedValue[0]
        const value = splitedValue[1]
        parsedCookieObject = { ...parsedCookieObject, [key]: value }
    });
    req.cookies = parsedCookieObject
    const decodedUser = jwt.verify(parsedCookieObject.authToken, "secret")
    req.user = decodedUser
    next()
}