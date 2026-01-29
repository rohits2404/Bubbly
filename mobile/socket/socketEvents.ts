import { getSocket } from "./socket";

type TestSocketHandler = (data: any) => void;

export function testSocket(
    payload: any | TestSocketHandler,
    off: boolean = false
) {
    const socket = getSocket();

    if (!socket) {
        console.log("Socket is not connected!");
        return;
    }

    // Remove listener
    if (off && typeof payload === "function") {
        socket.off("testSocket", payload);
        return;
    }

    // Add listener
    if (typeof payload === "function") {
        socket.on("testSocket", payload);
        return;
    }

    // Emit event
    socket.emit("testSocket", payload);
}

export function updateProfile(
    payload: any | TestSocketHandler,
    off: boolean = false
) {
    const socket = getSocket();

    if (!socket) {
        console.log("Socket is not connected!");
        return;
    }

    // Remove listener
    if (off && typeof payload === "function") {
        socket.off("updateProfile", payload);
        return;
    }

    // Add listener
    if (typeof payload === "function") {
        socket.on("updateProfile", payload);
        return;
    }

    // Emit event
    socket.emit("updateProfile", payload);
}