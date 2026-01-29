import { Server as SocketIOServer, Socket } from "socket.io";
import jwt, { type JwtPayload, type VerifyErrors } from "jsonwebtoken";
import http from "http";
import { registerUserEvents } from "./userEvents";

interface JwtUserPayload extends JwtPayload {
    user: {
        id: string;
        name: string;
        email?: string;
    };
}

export function initializeSocket(server: http.Server): SocketIOServer {
    const io = new SocketIOServer(server, {
        cors: {
            origin: "*"
        }
    });

    io.use((socket: Socket, next) => {
        const token = socket.handshake.auth?.token;

        if (!token) {
            return next(new Error("Authentication Error: No Token Provided"));
        }

        jwt.verify(token,process.env.JWT_SECRET as string,(err: VerifyErrors | null, decoded: JwtPayload | string | undefined) => {
            if (err || !decoded || typeof decoded === "string") {
                return next(new Error("Authentication Error: Invalid Token"));
            }

            const payload = decoded as JwtPayload & {
                user: {
                    id: string;
                    name: string;
                };
            };

            socket.data.user = payload.user;
            socket.data.userId = payload.user.id;

            next();
        });
    });

    io.on("connection", (socket: Socket) => {
        const { userId, user } = socket.data;

        console.log(`User Connected: ${userId}, Username: ${user?.name}`);

        registerUserEvents(io, socket);

        socket.on("disconnect", () => {
            console.log(`User Disconnected: ${userId}`);
        });
    });

    return io;
}