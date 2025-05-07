import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRobotStore } from "@/store/robotStore";

interface ConnectionStatusProps {
	minimal?: boolean;
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusProps> = ({
	minimal = false,
}) => {
	const { isConnected } = useRobotStore();

	if (minimal) {
		return (
			<View
				style={[
					styles.indicator,
					isConnected ? styles.connected : styles.disconnected,
				]}
			/>
		);
	}

	return (
		<View style={styles.container}>
			<View
				style={[
					styles.indicator,
					isConnected ? styles.connected : styles.disconnected,
				]}
			/>
			<MaterialIcons
				name={isConnected ? "wifi" : "wifi-off"}
				size={18}
				color={isConnected ? Colors.success : Colors.error}
				style={styles.icon}
			/>
			<Text
				style={[
					styles.text,
					isConnected
						? styles.connectedText
						: styles.disconnectedText,
				]}
			>
				{isConnected ? "Connected" : "Disconnected"}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
		borderRadius: 16,
		backgroundColor: Colors.cardBackground,
	},
	indicator: {
		width: 8,
		height: 8,
		borderRadius: 4,
		marginRight: 4,
	},
	connected: {
		backgroundColor: Colors.success,
	},
	disconnected: {
		backgroundColor: Colors.error,
	},
	icon: {
		marginRight: 4,
	},
	text: {
		fontSize: 14,
		fontWeight: "500",
	},
	connectedText: {
		color: Colors.success,
	},
	disconnectedText: {
		color: Colors.error,
	},
});

export default ConnectionStatusIndicator;
