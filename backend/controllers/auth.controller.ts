import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import User from "../models/User";
import { generateToken } from "../utils/token";

export const registerUser = async (
    req: Request,
    res: Response
): Promise<void> => {

    const { email, name, password, avatar } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ success: false, msg: "User Already Exists" });
            return;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            email,
            name,
            password: hashedPassword,
            avatar: avatar || "",
        });

        const token = generateToken(user);

        res.status(201).json({
            success: true,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};

export const loginUser = async (
    req: Request,
    res: Response
): Promise<void> => {
    
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email }).select("+password");
        if (!existingUser) {
            res.status(400).json({ success: false, msg: "Invalid Credentials" });
            return;
        }

        const isMatch = await bcrypt.compare(password, existingUser.password);
        if(!isMatch) {
            res.status(400).json({ success: false, msg: "Invalid Credentials" });
            return;
        }

        const token = generateToken(existingUser);

        res.status(201).json({
            success: true,
            token,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, msg: "Server error" });
    }
};