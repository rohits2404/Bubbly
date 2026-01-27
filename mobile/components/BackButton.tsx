import { colors } from "@/constants/theme";
import { BackButtonProps } from "@/types";
import { useRouter } from "expo-router";
import { StyleSheet, TouchableOpacity } from "react-native";
import { CaretLeftIcon } from "phosphor-react-native";
import { verticalScale } from "@/utils/styling";

export const BackButtton = ({ style, iconSize = 26, color = colors.white }: BackButtonProps) => {

    const router = useRouter();

    return (
        <TouchableOpacity
        onPress={() => router.back()}
        style={[styles.button, style]}
        >
            <CaretLeftIcon
            size={verticalScale(iconSize)}
            color={color}
            weight="bold"
            />
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {}
})