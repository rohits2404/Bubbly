import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { ScreenWrapper } from '@/components/ScreenWrapper';
import { colors, radius, spacingX, spacingY } from '@/constants/theme';
import { Header } from '@/components/Header';
import { BackButtton } from '@/components/BackButton';
import { Avatar } from '@/components/Avatar';
import * as ImagePicker from 'expo-image-picker';
import { Input } from '@/components/Input';
import { contacts } from '@/constants';
import { Typo } from '@/components/Typo';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/Button';
import { verticalScale } from '@/utils/styling';

const NewConversation = () => {

    const [isLoading,setIsLoading] = useState(false);
    const [groupName,setGroupName] = useState("");
    const [groupAvatar,setGroupAvatar] = useState<{ uri: string }|null>(null);
    const [selectedParticipants,setSelectedParticipants] = useState<string[]>([]);

    const { isGroup } = useLocalSearchParams();
    const isGroupMode = isGroup == "1"

    const router = useRouter();

    const { user: currentUser } = useAuth();

    const onPickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images', 'videos'],
            aspect: [4, 3],
            quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
            setGroupAvatar(result.assets[0])
        }
    };

    const toggleParticipants = (user: any) => {
        setSelectedParticipants((prev: any) => {
            if(prev.includes(user.id)) {
                return prev.filter((id: string) => id != user.id)
            }
            return [...prev, user.id]
        })
    }

    const onSelectUser = (user: any) => {
        if(!currentUser) {
            Alert.alert("Unauthorized", "Please Login To Start a Conversation!")
            return;
        }
        if(isGroupMode) {
            toggleParticipants(user)
        } else {

        }
    }

    const createGroup = async () => {
        if(!groupName.trim() || !currentUser || selectedParticipants.length < 2) {
            return;
        }
    }

    return (
        <ScreenWrapper
        isModal={true}
        >
            <View
            style={styles.container}
            >
                <Header
                title={isGroupMode ? "New Group" : "Select User"}
                leftIcon={<BackButtton color={colors.black} />}
                />
                {isGroupMode && (
                    <View
                    style={styles.groupInfoContainer}
                    >
                        <View
                        style={styles.avatarContainer}
                        >
                            <TouchableOpacity
                            onPress={onPickImage}
                            >
                                <Avatar
                                uri={groupAvatar?.uri || null}
                                isGroup={true}
                                size={100}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                        style={styles.groupNameContainer}
                        >
                            <Input
                            placeholder='Group Name'
                            value={groupName}
                            onChangeText={setGroupName}
                            />
                        </View>
                    </View>
                )}
                <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.contactList}
                >
                    {contacts.map((user: any, index) => {
                        const isSelected = selectedParticipants.includes(user.id);
                        return (
                            <TouchableOpacity
                            key={index}
                            style={[styles.contactRow, isSelected && styles.selectedContact]}
                            onPress={() => onSelectUser(user)}
                            >
                                <Avatar
                                size={45}
                                uri={user.avatar}
                                />
                                <Typo
                                fontWeight={"600"}
                                >
                                    {user.name}
                                </Typo>
                                {isGroupMode && (
                                    <View
                                    style={styles.selectionIndicator}
                                    >
                                        <View
                                        style={[styles.checkbox, isSelected && styles.checked]}
                                        />
                                    </View>
                                )}
                            </TouchableOpacity>
                        )
                    })}
                </ScrollView>
                {isGroupMode && selectedParticipants.length >= 2 && (
                    <View
                    style={styles.createGroupButton}
                    >
                        <Button
                        onPress={createGroup}
                        disabled={!groupName.trim()}
                        loading={isLoading}
                        >
                            <Typo
                            fontWeight={"bold"}
                            size={17}
                            >
                                Create Group
                            </Typo>
                        </Button>
                    </View>
                )}
            </View>
        </ScreenWrapper>
    )
}

export default NewConversation

const styles = StyleSheet.create({
    container: {
        marginHorizontal: spacingX._15,
        flex: 1
    },
    groupInfoContainer: {
        alignItems: "center",
        marginTop: spacingY._10
    },
    avatarContainer: {
        marginBottom: spacingY._10
    },
    groupNameContainer: {
        width: "100%"
    },
    contactRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: spacingX._10,
        paddingVertical: spacingY._5
    },
    selectedContact: {
        backgroundColor: colors.neutral100,
        borderRadius: radius._15
    },
    contactList: {
        gap: spacingY._12,
        marginTop: spacingY._10,
        paddingTop: spacingY._10,
        paddingBottom: verticalScale(150)
    },
    selectionIndicator: {
        marginLeft: "auto",
        marginRight: spacingX._10
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: colors.primary
    },
    checked: {
        backgroundColor: colors.primary
    },
    createGroupButton: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: spacingX._15,
        backgroundColor: colors.white,
        borderTopWidth: 1,
        borderTopColor: colors.neutral200
    }
})