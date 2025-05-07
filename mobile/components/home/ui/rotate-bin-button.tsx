import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import { useRobotStore } from "@/store/robotStore";
import { useSocket } from "@/hooks/useSocket";

interface RotateBinButtonProps {
	disabled?: boolean;
}

const RotateBinButton: React.FC<RotateBinButtonProps> = ({
	disabled = false,
}) => {
	const { binStatus } = useRobotStore();
	const { isConnected, sendCommand } = useSocket();

	const handleRotateBin = () => {
		if (!isConnected) return;
		sendCommand("ROTATE_BIN", 0);
	};

	return (
		<TouchableOpacity
			style={[styles.button, disabled && styles.disabledButton]}
			onPress={handleRotateBin}
			disabled={disabled || !isConnected}
		>
			<MaterialIcons name="autorenew" size={28} color="white" />
			<Text style={styles.buttonText}>Rotate Bin</Text>

			{binStatus && (
				<View style={styles.statusBadge}>
					<Text style={styles.badgeText}>{binStatus.currentBin}</Text>
				</View>
			)}
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	button: {
		backgroundColor: Colors.primary,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
		paddingHorizontal: 16,
		borderRadius: 12,
		marginHorizontal: 8,
		position: "relative",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
		marginLeft: 8,
	},
	disabledButton: {
		backgroundColor: Colors.lightGray,
		opacity: 0.7,
	},
	statusBadge: {
		position: "absolute",
		top: -8,
		right: -8,
		backgroundColor: Colors.success,
		width: 24,
		height: 24,
		borderRadius: 12,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "white",
	},
	badgeText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 12,
	},
});

export default RotateBinButton;
