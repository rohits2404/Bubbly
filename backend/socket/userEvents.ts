import { Socket, Server as SocketIOServer } from "socket.io";
import User from "../models/User";
import { generateToken } from "../utils/token";

export function registerUserEvents(io: SocketIOServer, socket: Socket) {
    socket.on("testSocket", () => {
        socket.emit("testSocket", {
            msg: "Realtime Updates!!!"
        });
    });
    socket.on("updateProfile", async (data: { name?: string; avatar?: string }) => {
        console.log("Update Profile Event: ", data);
        const userId = socket.data.userId;
        if(!userId) {
            return socket.emit("updateProfile", {
                success: false, msg: "Unauthorized"
            })
        }
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, { name: data.name, avatar: data.avatar }, { new: true });
            if(!updatedUser) {
                return socket.emit("updateProfile", {
                    success: false, msg: "User Not Found!"
                })
            }
            const newToken = generateToken(updatedUser);
            socket.emit("updateProfile", {
                success: true,
                data: { token: newToken },
                msg: "Profile Updated Successfully!"
            })
        } catch (error) {
            console.log("Error Updating Profile: ", error);
            socket.emit("updateProfile", {
                success: false, msg: "Error Updating Profile"
            })
        }
    })
}