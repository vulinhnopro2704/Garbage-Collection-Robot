import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Colors } from "@/constants/Colors";
import { useSocket } from "@/hooks/useSocket";

export default function Header() {
	const { isPoweredOn } = useSocket();

	return (
		<View style={styles.header}>
			<View style={styles.titleContainer}>
				<Text style={styles.title}>SmartBin</Text>
				<View
					style={[
						styles.statusIndicator,
						isPoweredOn ? styles.poweredOn : styles.poweredOff,
					]}
				/>
			</View>

			<View style={styles.subtitle}>
				<Text style={styles.subtitleText}>Control Panel</Text>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	header: {
		marginBottom: 10,
		paddingVertical: 4,
	},
	titleContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		color: Colors.text,
		marginRight: 10,
	},
	subtitle: {
		marginTop: 2,
	},
	subtitleText: {
		fontSize: 14,
		color: Colors.textDim,
		fontWeight: "500",
	},
	statusIndicator: {
		width: 10,
		height: 10,
		borderRadius: 5,
	},
	poweredOn: {
		backgroundColor: Colors.success,
	},
	poweredOff: {
		backgroundColor: Colors.error,
	},
});
