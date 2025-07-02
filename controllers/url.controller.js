import { Url } from "../models/url.models.js"
import fs from "fs"
import ejs from "ejs"
import { projectDir } from "../index.js"
import shortid from "shortid"
import { UAParser } from "ua-parser-js"


const createShortUrl = async (req, res) => {
    const { originalUrl } = req.body
    const userId = req.user._id

    const urlShortId = shortid.generate()

    const urlDoc = await Url.create({
        createdBy: userId,
        shortId: urlShortId,
        redirectUrl: originalUrl,
    })

    res.writeHead(302, { "Location": "/url" })
    res.end()
}

const handleHomePage = async (req, res) => {
    if (!req.user) {
        res.writeHead(301, { "Location": "http://localhost:3000/users/login" })
        return res.end()
    }

    const urlDocs = await Url.find({ createdBy: req.user._id })
    fs.readFile(`${projectDir}/views/home.ejs`, "utf-8", (err, template) => {
        const html = ejs.render(template, { urlDocs, fullname: req.user.fullname })
        res.end(html)
    })
}

const handleAnalyticsPage = async (req, res) => {
    if (!req.user) {
        res.writeHead(301, { "Location": "http://localhost:3000/users/login" })
        return res.end()
    }

    const urlDoc = await Url.findOne({ shortId: req.params.shortId })
    if (urlDoc) {
        fs.readFile(`${projectDir}/views/analytics.ejs`, "utf-8", (err, template) => {
            const html = ejs.render(template, {
                historyClicked: urlDoc.historyClicked,
                createdBy: req.user.fullname,
                shortId: urlDoc.shortId
            })
            res.end(html)
        })
    }
    else {
        res.end("Wrong short id parameter")
    }
}

const handleShortUrlClick = async (req, res) => {
    const parser = new UAParser()
    const result = parser.setUA(req.headers["user-agent"]).getResult()

    const urlDoc = await Url.findOneAndUpdate(
        { shortId: req.shortId },
        {
            $push: {
                historyClicked: {
                    timestamp: Date.now(),
                    ip: req.socket.remoteAddress,
                    device: result.os
                }
            }
        },
        { new: true }
    )
    console.log("Updated doc", urlDoc)
    if (!urlDoc) {
        res.writeHead(404)
        return res.end("This page does not exists")
    }

    res.writeHead(301, { "Location": urlDoc.redirectUrl })
    res.end()
}

export {
    createShortUrl,
    handleHomePage,
    handleShortUrlClick,
    handleAnalyticsPage
}