import { StyleSheet } from "react-native";
import React, { useEffect } from "react";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Typo } from "@/components/Typo";
import { colors } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/Button";
import { testSocket } from "@/socket/socketEvents";

const Home = () => {

    const { signOut } = useAuth();

    const testSocketCallbackHandler = React.useCallback((data: any) => {
        console.log("Got Response:", data);
    }, []);

    useEffect(() => {
        testSocket(testSocketCallbackHandler);
        testSocket({ ping: true });
        return () => {
            testSocket(testSocketCallbackHandler, true);
        };
    }, []);

    const handleLogout = async () => {
        await signOut();
    };

    return (
        <ScreenWrapper>
            <Typo 
            color={colors.white}
            >
                Home
            </Typo>

            <Button 
            onPress={handleLogout}
            >
                <Typo>
                    Logout
                </Typo>
            </Button>
        </ScreenWrapper>
    );
};

export default Home;

const styles = StyleSheet.create({});