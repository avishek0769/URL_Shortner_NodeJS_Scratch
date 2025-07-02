import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import fs from "fs";
import ejs from "ejs"


const createUser = async (req, res) => {
    console.log("Body --> ", req.body)
    const { fullname, email, password } = req.body
    const user = await User.create({
        fullname, email, password
    })
    res.writeHead(200)
    res.end(JSON.stringify({ message: "success", _id: user._id }))
}

const loginUser = async (req, res) => {
    const { email, password } = req.body
    const user = await User.find({ 
        email, password
    })
    if(!user) {
        res.writeHead(404)
        res.end(JSON.stringify({ success: false, message: "Invalid username or password" }))
    }
    const token = jwt.sign({ _id: user._id, email: user.email })

    res.writeHead(200)
    res.setHeader("authToken", token)
    res.end(JSON.stringify({ success: true, _id: user._id }))
}

const handleSignupPage = (req, res) => {
    const filePath = "/home/avishek-adhikary/Desktop/programming/POCs/URL_Shortner_SSR_NodeJS/views/signup.ejs"
    fs.readFile(filePath, "utf-8", (err, template) => {
        if(err) {
            console.log(err)
            res.end(String(err))
            return
        }
        let html = ejs.render(template, {})
        res.end(html)
    })
}

const handleLoginPage = (req, res) => {
    const filePath = "/home/avishek-adhikary/Desktop/programming/POCs/URL_Shortner_SSR_NodeJS/views/login.ejs"
    fs.readFile(filePath, "utf-8", (err, template) => {
        if(err) {
            res.end(String(err))
            return
        }
        let html = ejs.render(template, {})
        res.end(html)
    })
}


export {
    createUser,
    loginUser,
    handleSignupPage,
    handleLoginPage
}