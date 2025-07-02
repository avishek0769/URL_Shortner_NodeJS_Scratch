
export const bodyParser = (req, res, next) => {
    let rawData = ""
    req.on("data", (chunk) => {
        rawData += chunk
    })
    req.on("end", () => {
        if(req.headers["content-type"] == "application/x-www-form-urlencoded") {
            let body = {};
            rawData.split("&").forEach(pair => {
                let splitedValue = pair.split("=")
                let key = splitedValue[0]
                let value = splitedValue[1].replaceAll("%40", "@").replaceAll("%20", " ").replaceAll("%3A", ":").replaceAll("%2F", "/")
                body = { ...body, [key]: value }
            })
            req.body = body
        }
        else if(req.headers["content-type"] == "application/json") {
            req.body = JSON.parse(rawData)
        }
        next()
    })
}