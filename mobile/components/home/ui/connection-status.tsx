import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

interface ConnectionStatusProps {
	isConnected: boolean;
	isConnecting: boolean;
	error: string | null;
	reconnectAttempt: number;
	minimal?: boolean;
}

const ConnectionStatusIndicator: React.FC<ConnectionStatusProps> = ({
	isConnected,
	isConnecting,
	error,
	reconnectAttempt,
	minimal = false,
}) => {
	// Determine the status text and icon based on connection state
	type MaterialIconName = React.ComponentProps<typeof MaterialIcons>["name"];

	const getStatusInfo = (): {
		text: string;
		icon: MaterialIconName;
		color: string;
	} => {
		if (isConnected) {
			return {
				text: "Connected to robot",
				icon: "check-circle" as MaterialIconName,
				color: "#4CAF50", // Green
			};
		}

		if (isConnecting) {
			return {
				text: `Connecting (Attempt ${reconnectAttempt})...`,
				icon: "sync" as MaterialIconName,
				color: "#FFC107", // Amber
			};
		}

		if (error) {
			return {
				text: `Connection error: ${error}`,
				icon: "error" as MaterialIconName,
				color: "#F44336", // Red
			};
		}

		return {
			text: "Disconnected",
			icon: "wifi-off" as MaterialIconName,
			color: "#9E9E9E", // Grey
		};
	};

	const { text, icon, color } = getStatusInfo();

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
			<View style={styles.statusContainer}>
				{isConnecting ? (
					<ActivityIndicator
						size="small"
						color={color}
						style={styles.icon}
					/>
				) : (
					<MaterialIcons
						name={icon}
						size={16}
						color={color}
						style={styles.icon}
					/>
				)}
				<Text style={[styles.statusText, { color }]}>{text}</Text>
			</View>

			{/* Additional debug info */}
			{error && <Text style={styles.errorText}>{error}</Text>}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 8,
		backgroundColor: Colors.cardBackground,
		borderRadius: 8,
	},
	statusContainer: {
		flexDirection: "row",
		alignItems: "center",
	},
	icon: {
		marginRight: 8,
	},
	statusText: {
		fontWeight: "bold",
	},
	errorText: {
		color: "#F44336",
		fontSize: 12,
		marginTop: 4,
		marginLeft: 24,
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
});

export default ConnectionStatusIndicator;
