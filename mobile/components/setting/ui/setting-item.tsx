import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface SettingItemProps {
	icon: React.ReactNode;
	title: string;
	description?: string;
	rightElement?: React.ReactNode;
	onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
	icon,
	title,
	description,
	rightElement,
	onPress,
}) => (
	<TouchableOpacity
		style={styles.settingItem}
		onPress={onPress}
		disabled={!onPress}
	>
		<View style={styles.settingIconContainer}>{icon}</View>
		<View style={styles.settingContentContainer}>
			<Text style={styles.settingTitle}>{title}</Text>
			{description && (
				<Text style={styles.settingDescription}>{description}</Text>
			)}
		</View>
		<View style={styles.settingRightElement}>
			{rightElement || (
				<MaterialIcons
					name="chevron-right"
					size={24}
					color={Colors.textSecondary}
				/>
			)}
		</View>
	</TouchableOpacity>
);

const styles = StyleSheet.create({
	settingItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		paddingVertical: 8,
	},
	settingIconContainer: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.05)",
		borderRadius: 20,
		marginRight: 12,
	},
	settingContentContainer: {
		flex: 1,
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: "500",
		color: Colors.text,
	},
	settingDescription: {
		fontSize: 14,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	settingRightElement: {
		marginLeft: 8,
	},
});

export default SettingItem;
