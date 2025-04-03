import React from "react";
import { StyleSheet, Text, View } from "react-native";
import SettingsButton from "../ui/setting-button";
import { router } from "expo-router";
import { Colors } from "@/constants/Colors";
export default function Header() {
	return (
		<View style={styles.header}>
			{/* <ConnectionStatus isConnected={isConnected} /> */}
			<Text style={styles.title}>Control</Text>
			<SettingsButton onPress={() => router.push("/(tabs)/setting")} />
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
		paddingVertical: 4,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: Colors.text,
	},
});
