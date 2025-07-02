
export const requestPipeline = (req, res, initialRoute, routes, extraArgs) => {
    for (const elem of routes) {
        if(elem.method == req.method && (initialRoute + elem.route) == req.url){
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