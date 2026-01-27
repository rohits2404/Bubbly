import { AuthProvider } from "@/context/AuthContext"
import { Stack } from "expo-router"

const StackLayout = () => {
    return (
        <Stack
        screenOptions={{ headerShown: false }}
        />
    )
}

const RootLayout = () => {
    return (
        <AuthProvider>
            <StackLayout/>
        </AuthProvider>
    )
}

export default RootLayout;