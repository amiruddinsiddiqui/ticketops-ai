import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../entity/user.js"
import { inngest } from "../inngest/client.js"



export const signup = async (req, res) => {
    const { email, password, skills = [] } = req.body

    try {
        const hashed = await bcrypt.hash(password, 10)
        const user = await User.create({ email, password: hashed, skills })

        
        try {
            await inngest.send({
                name: "user/signup",
                data: {
                    email
                }
            })
        } catch (inngestError) {
            console.error("Inngest event failed:", inngestError.message)
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY
        )

        res.json({ user, token })

    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Signup failed", details: error.message })
    }
}


export const login = async (req, res) => {
    const { email, password } = req.body

    try {
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ error: "User not found" })

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return res.status(401).json({ error: "invalid credentails" })
        }

        const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET_KEY
        )

        res.json({ user, token })

    } catch (error) {
        res.status(500).json({ error: "Login failed", details: error.message })
    }
}


export const logout = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]

        if (!token) {
            return res.status(401).json({ error: "Unauthorized" })
        }
        jwt.verify(
            token,
            process.env.JWT_SECRET_KEY,
            (err, decoded) => {
                if (err) return res.status(401).json({ error: "Unauthorized" })
                res.json({ message: "Logout Successfull" })
            }
        )

    } catch (error) {
        res.status(500).json({ error: "Error while logging out", details: error.message })
    }
}


export const updateUser = async (req, res, next) => {
    const { skills = [], role, email } = req.body
    try {
        if (req.user?.role != "admin") {
            return res.status(403).json({ error: "Forbidden" })
        }
        const user = await User.findOne({ email })
        if (!user) return res.status(401).json({ error: "User not found" });

        await User.updateOne(
            { email },
            { skills: skills.length ? skills : user.skills, role }
        )
        return res.json({ message: "User updated successfully" })
    } catch (error) {
        res.status(500).json({ error: "error occured while updating user", details: error.message })
    }
}


export const getUser = async (req, res, next) => {
    try {
        if (req.user.role !== "admin") {
            return res.status(403).json({ error: "fobidden" })
        }
        const users = await User.find().select("-password");
        return res.status(200).json({ users })
    } catch (error) {
        res.status(500).json({ error: "error occured while finding users", details: error.message })
    }
}