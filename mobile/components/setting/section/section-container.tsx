import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface SectionContainerProps {
	title: string;
	children: React.ReactNode;
}

const SectionContainer: React.FC<SectionContainerProps> = ({
	title,
	children,
}) => (
	<View style={styles.section}>
		<Text style={styles.sectionTitle}>{title}</Text>
		{children}
	</View>
);

const styles = StyleSheet.create({
	section: {
		backgroundColor: Colors.cardBackground,
		marginHorizontal: 16,
		marginTop: 16,
		padding: 16,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: Colors.text,
		marginBottom: 12,
	},
});

export default SectionContainer;
