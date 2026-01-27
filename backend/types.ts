import { Types } from "mongoose";
import type { HydratedDocument } from "mongoose";

/* User */
export interface UserProps {
    email: string;
    password: string;
    name: string;
    avatar?: string;
}

/* Conversation */
export interface ConversationProps {
    type: "direct" | "group";
    name?: string;
    participants: Types.ObjectId[];
    lastMessage?: Types.ObjectId;
    createdBy?: Types.ObjectId;
    avatar?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export type UserDocument = HydratedDocument<UserProps>;