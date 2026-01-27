import mongoose from "mongoose";
import type { UserProps } from "../types";

const userSchema = new mongoose.Schema<UserProps>({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        select: false,
    },
    name: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
        default: "",
    },
},{ timestamps: true });

export default mongoose.model<UserProps>("User", userSchema);