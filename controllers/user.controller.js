import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import fs from "fs";
import ejs from "ejs"
import { projectDir } from "../index.js";


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
    console.log("Login --> ", req.body)
    const { email, password } = req.body
    const user = await User.findOne({
        email, password

    })
    if (!user) {
        const filePath = `${projectDir}/views/login.ejs`
        fs.readFile(filePath, "utf-8", (err, template) => {
            if (err) return res.end(err.toString());

            const html = ejs.render(template, { message: "Invalid username or password" })
            res.writeHead(404)
            res.end(html)
        })
    }
    else {
        const token = jwt.sign({ _id: user._id, email: user.email, fullname: user.fullname }, "secret")
        
        res.setHeader('Set-Cookie', `authToken=${token};path=/`);
        res.writeHead(301, { "Location": "http://localhost:3000/url" })
        res.end()
    }
}

const handleSignupPage = (req, res) => {
    const filePath = `${projectDir}/views/signup.ejs`
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
    const filePath = `${projectDir}/views/login.ejs`
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