import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useRobotStore } from "@/store/robotStore";
import { Colors } from "@/constants/Colors";

const BinStatusDisplay = () => {
	const { binStatus } = useRobotStore();

	if (!binStatus) {
		return null;
	}

	return (
		<View style={styles.container}>
			<View style={styles.iconContainer}>
				<MaterialIcons
					name="autorenew"
					size={24}
					color={
						binStatus.status === "success"
							? Colors.success
							: Colors.warning
					}
				/>
			</View>
			<View style={styles.textContainer}>
				<Text style={styles.title}>Bin Status</Text>
				<Text style={styles.statusText}>
					Current Bin:{" "}
					<Text style={styles.highlight}>{binStatus.currentBin}</Text>
				</Text>
				<Text
					style={[
						styles.statusBadge,
						binStatus.status === "success"
							? styles.successBadge
							: styles.warningBadge,
					]}
				>
					{binStatus.status.toUpperCase()}
				</Text>
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
