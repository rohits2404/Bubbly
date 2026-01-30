import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { ScreenWrapper } from "@/components/ScreenWrapper";
import { Typo } from "@/components/Typo";
import { colors, radius, spacingX, spacingY } from "@/constants/theme";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/Button";
import { testSocket } from "@/socket/socketEvents";
import { verticalScale } from "@/utils/styling";
import * as Icons from "phosphor-react-native";
import { useRouter } from "expo-router";
import { conversations } from "@/constants";
import { Loading } from "@/components/Loading";
import { ConversationItem } from "@/components/ConversationItem";

const Home = () => {

    const router = useRouter();

    const { user: currentUser } = useAuth();

    const [selectedTab,setSelectedTab] = useState(0);
    const [loading, setLoading] = useState(true);

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

    const sortByLatest = (a: any, b: any) => {
        const aDate = a?.lastMessage?.createdAt ?? a?.createdAt ?? 0;
        const bDate = b?.lastMessage?.createdAt ?? b?.createdAt ?? 0;
        return new Date(bDate).getTime() - new Date(aDate).getTime();
    };

    const directConversations = conversations.filter((item: any) => item.type === "direct").sort(sortByLatest);

    const groupConversations = conversations.filter((item: any) => item.type === "group").sort(sortByLatest);

    return (
        <ScreenWrapper
        showPattern={true}
        bgOpacity={0.5}
        >
            <View
            style={styles.container}
            >
                <View
                style={styles.header}
                >
                    <View
                    style={{flex: 1}}
                    >
                        <Typo
                        color={colors.neutral200}
                        size={19}
                        textProps={{ numberOfLines: 1 }}
                        >
                            Welcome Back,
                            <Typo
                            size={20}
                            color={colors.white}
                            fontWeight={"800"}
                            >
                                {currentUser?.name}
                            </Typo>
                        </Typo>
                    </View>
                    <TouchableOpacity
                    style={styles.settingIcon}
                    onPress={() => router.push("/(main)/profileModal")}
                    >   
                        <Icons.GearIcon
                        color={colors.white}
                        weight="fill"
                        size={verticalScale(22)}
                        />
                    </TouchableOpacity>
                </View>
                <View
                style={styles.content}
                >
                    <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{paddingVertical: spacingY._20}}
                    >
                        <View
                        style={styles.navbar}
                        >
                            <View
                            style={styles.tabs}
                            >
                                <TouchableOpacity
                                style={[styles.tabStyle, selectedTab === 0 && styles.activeTabStyle]}
                                onPress={() => setSelectedTab(0)}
                                >
                                    <Typo>
                                        Direct Messages
                                    </Typo>
                                </TouchableOpacity>
                                <TouchableOpacity
                                style={[styles.tabStyle, selectedTab === 0 && styles.activeTabStyle]}
                                onPress={() => setSelectedTab(1)}
                                >
                                    <Typo>
                                        Groups
                                    </Typo>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View
                        style={styles.conversationList}
                        >
                            {selectedTab == 0 && directConversations.map((item: any, index) => {
                                return (
                                    <ConversationItem
                                    item={item}
                                    key={index}
                                    router={router}
                                    showDivider={directConversations.length != index + 1}
                                    />
                                )
                            })}
                            {selectedTab == 1 && groupConversations.map((item: any, index) => {
                                return (
                                    <ConversationItem
                                    item={item}
                                    key={index}
                                    router={router}
                                    showDivider={directConversations.length != index + 1}
                                    />
                                )
                            })}
                        </View>
                        {
                            !loading && selectedTab == 0 && directConversations.length == 0 && (
                                <Typo
                                style={{textAlign: "center"}}
                                >
                                    You Don&apos;t Have any Messages!
                                </Typo>
                            )
                        }
                        {
                            !loading && selectedTab == 1 && groupConversations.length == 0 && (
                                <Typo
                                style={{textAlign: "center"}}
                                >
                                    You Haven&apos;t Join any Groups Yet!
                                </Typo>
                            )
                        }
                        {loading && <Loading/>}
                    </ScrollView>
                </View>
            </View>
            <Button
            style={styles.floatingButton}
            onPress={() => router.push({
                pathname: "/(main)/newConversationModal",
                params: {isGroup: selectedTab}
            })}
            >
                <Icons.PlusIcon
                color={colors.black}
                weight="bold"
                size={verticalScale(24)}
                />
            </Button>
        </ScreenWrapper>
    );
};

export default Home;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: spacingX._20,
        gap: spacingY._15,
        paddingTop: spacingY._15,
        paddingBottom: spacingY._20
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    content: {
        flex: 1,
        backgroundColor: colors.white,
        borderTopLeftRadius: radius._50,
        borderTopRightRadius: radius._50,
        borderCurve: "continuous",
        overflow: "hidden",
        paddingHorizontal: spacingX._20
    },
    navbar: {
        flexDirection: "row",
        gap: spacingX._15,
        alignItems: "center",
        paddingHorizontal: spacingX._10
    },
    tabs: {
        flexDirection: "row",
        gap: spacingX._10,
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    tabStyle: {
        paddingVertical: spacingY._10,
        paddingHorizontal: spacingX._20,
        borderRadius: radius.full,
        backgroundColor: colors.neutral100
    },
    activeTabStyle: {
        backgroundColor: colors.primaryLight
    },
    conversationList: {
        paddingVertical: spacingY._20
    },
    settingIcon: {
        padding: spacingY._10,
        backgroundColor: colors.neutral700,
        borderRadius: radius.full
    },
    floatingButton: {
        height: verticalScale(50),
        width: verticalScale(50),
        borderRadius: 100,
        position: "absolute",
        bottom: verticalScale(30),
        right: verticalScale(30)
    }
});