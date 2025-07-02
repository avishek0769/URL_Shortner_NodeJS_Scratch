import { Url } from "../models/url.models.js"
import fs from "fs"
import ejs from "ejs"
import { projectDir } from "../index.js"
import shortid from "shortid"
import {UAParser} from "ua-parser-js"


const createShortUrl = async (req, res) => {
    console.log(req.body)
    const { originalUrl } = req.body
    const userId = req.user._id

    const urlShortId = shortid.generate()
    const parser = new UAParser()
    const result = parser.setUA(req.headers["user-agent"]).getResult()

    const urlDoc = await Url.create({
        createdBy: userId,
        shortId: urlShortId,
        redirectUrl: originalUrl,
        // historyClicked: {
        //     timestamp: Date.now(),
        //     ip: req.socket.remoteAddress,
        //     device: result.os
        // }
    })
    console.log(urlDoc)
    res.writeHead(302, { "Location": "/url" })
    res.end()
}

const handleHomePage = async (req, res) => {
    if (!req.user) {
        res.writeHead(301, { "Location": "http://localhost:3000/users/login" })
        return res.end()
    }
    console.log(req.user)
    const urlDocs = await Url.find({ createdBy: req.user._id })
    fs.readFile(`${projectDir}/views/home.ejs`, "utf-8", (err, template) => {
        const html = ejs.render(template, { urlDocs, fullname: req.user.fullname })
        res.end(html)
    })
}

export {
    createShortUrl,
    handleHomePage
}