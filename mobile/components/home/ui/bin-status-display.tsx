import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useSocket } from "@/hooks/useSocket";

const BinStatusDisplay = () => {
	const { binStatus } = useSocket();

	if (!binStatus) {
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<MaterialIcons
					name="autorenew"
					size={24}
					color={Colors.success}
				/>
			</View>
			<View style={styles.textContainer}>
				<Text style={styles.title}>Bin Status</Text>
				<Text style={styles.statusText}>
					Current Bin:{" "}
					<Text style={styles.highlight}>{binStatus}</Text>
				</Text>
				<Text style={[styles.statusBadge]}>{binStatus}</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		backgroundColor: "rgba(0,0,0,0.7)",
		borderRadius: 12,
		padding: 12,
		marginVertical: 8,
		alignItems: "center",
	},
	iconContainer: {
		marginRight: 12,
	},
	textContainer: {
		flex: 1,
	},
	title: {
		color: "#fff",
		fontWeight: "bold",
		fontSize: 16,
		marginBottom: 4,
	},
	statusText: {
		color: "#ddd",
		fontSize: 14,
	},
	highlight: {
		color: "#fff",
		fontWeight: "bold",
	},
	statusBadge: {
		paddingHorizontal: 8,
		paddingVertical: 2,
		borderRadius: 4,
		alignSelf: "flex-start",
		marginTop: 6,
		fontSize: 12,
		fontWeight: "bold",
	},
	successBadge: {
		backgroundColor: Colors.success,
		color: "#fff",
	},
	warningBadge: {
		backgroundColor: Colors.warning,
		color: "#000",
	},
});

export default BinStatusDisplay;
