
export const requestPipeline = (req, res, initialRoute, routes, extraArgs) => {
    
    for (const elem of routes) {
        let routeCheck = false;
        let parsedParams = {}

        if(elem.route.includes(":")){
            const individualRoutesAccessed = req.url.split("/")
            const individualRoutesExpected = (initialRoute + elem.route).split("/")

            if(individualRoutesAccessed.length === individualRoutesExpected.length) {
                for (let i = 0; i < individualRoutesAccessed.length; i++) {
                    if(individualRoutesAccessed[i] != individualRoutesExpected[i]){
                        if(individualRoutesExpected[i].startsWith(":")){
                            parsedParams = { 
                                ...parsedParams,
                                [individualRoutesExpected[i].slice(1)]: individualRoutesAccessed[i]
                            }
                        }
                        else routeCheck = false
                    }
                }
                req.params = parsedParams
                routeCheck = true
            }
            else routeCheck = false
        }
        else {
            routeCheck = (initialRoute + elem.route) == req.url
        }

        if(elem.method == req.method && routeCheck){
            let i = 0

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