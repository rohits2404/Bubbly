import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export async function connectSocket(): Promise<Socket> {
    const token = await AsyncStorage.getItem("token");
    if (!token) {
        throw new Error("No Token Found. User Must Login First!");
    }

    if (!process.env.EXPO_PUBLIC_API_URL) {
        throw new Error("API URL is not defined");
    }

    if (!socket) {
        socket = io(process.env.EXPO_PUBLIC_API_URL, {
            auth: { token },
            transports: ["websocket"],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        await new Promise<void>((resolve, reject) => {
            socket!.once("connect", () => {
                console.log("Socket Connected:", socket!.id);
                resolve();
            });

            socket!.once("connect_error", (err) => {
                console.error("Socket Connection Error:", err.message);
                reject(err);
            });
        });

        socket.on("disconnect", (reason) => {
            console.log("Socket Disconnected:", reason);
        });
    }

    return socket;
}

export function getSocket(): Socket | null {
    return socket;
}

export function disconnectSocket(): void {
    if (socket) {
        socket.removeAllListeners();
        socket.disconnect();
        socket = null;
    }
}