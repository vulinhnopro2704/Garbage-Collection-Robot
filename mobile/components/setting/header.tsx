import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface HeaderProps {
	title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => (
	<View style={styles.header}>
		<Text style={styles.headerTitle}>{title}</Text>
	</View>
);

const styles = StyleSheet.create({
	header: {
		padding: 16,
		paddingBottom: 8,
		backgroundColor: Colors.cardBackground,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.05)",
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: Colors.text,
	},
});

export default Header;
