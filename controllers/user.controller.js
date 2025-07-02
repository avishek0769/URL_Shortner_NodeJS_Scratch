import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import fs from "fs";
import ejs from "ejs"


const createUser = async (req, res) => {
    console.log("Sign up --> ", req.body)
    const { fullname, email, password } = req.body
    const user = await User.create({
        fullname, email, password
    })
    res.writeHead(301, { "Location": "http://localhost:3000/users/login" })
    res.end()
}

const loginUser = async (req, res) => {
    console.log("Login up --> ", req.body)
    const { email, password } = req.body
    const user = await User.findOne({
        email, password
    })
    console.log("User", user)
    if (!user) {
        const filePath = "/home/avishek-adhikary/Desktop/programming/POCs/URL_Shortner_SSR_NodeJS_Scartch/views/login.ejs"
        fs.readFile(filePath, "utf-8", (err, template) => {
            if (err) return res.end(err.toString());

            const html = ejs.render(template, { message: "Invalid username or password" })
            res.writeHead(404)
            res.end(html)
        })
    }
    else {
        const token = jwt.sign({ _id: user._id, email: user.email }, "secret")
        
        res.setHeader('Set-Cookie', `authToken=${token}`);
        res.writeHead(200)
        res.end(JSON.stringify({ success: true, _id: user._id }))
    }
}

const handleSignupPage = (req, res) => {
    const filePath = "/home/avishek-adhikary/Desktop/programming/POCs/URL_Shortner_SSR_NodeJS_Scartch/views/signup.ejs"
    fs.readFile(filePath, "utf-8", (err, template) => {
        if (err) {
            console.log(err)
            res.end(String(err))
            return
        }
        let html = ejs.render(template, {})
        res.end(html)
    })
}

const handleLoginPage = (req, res) => {
    const filePath = "/home/avishek-adhikary/Desktop/programming/POCs/URL_Shortner_SSR_NodeJS_Scartch/views/login.ejs"
    fs.readFile(filePath, "utf-8", (err, template) => {
        if (err) {
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