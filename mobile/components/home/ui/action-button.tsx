import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ControlButton from "./control-button";
import { Colors } from "@/constants/Colors";
// Use the same command types as in control.tsx for consistency
type ActionCommand = "GRAB_TRASH" | "ROTATE_BIN";

interface ActionControlsProps {
	onPress: (command: ActionCommand) => void;
	disabled?: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
	onPress,
	disabled = false,
}) => {
	return (
		<View style={styles.container}>
			{/* Rotate Bin Button */}
			<View style={styles.buttonContainer}>
				<Text
					style={[
						styles.buttonLabel,
						disabled && styles.disabledText,
					]}
				>
					Rotate Bin
				</Text>
				<ControlButton
					onPress={() => onPress("ROTATE_BIN")}
					disabled={disabled}
					style={styles.actionButton}
					activeStyle={styles.activeActionButton}
					icon="rotate-3d-variant"
				>
					<MaterialCommunityIcons
						name="rotate-3d-variant"
						size={32}
						color={disabled ? Colors.textSecondary : "white"}
					/>
				</ControlButton>
			</View>

			{/* Grab Trash Button */}
			<View style={styles.buttonContainer}>
				<Text
					style={[
						styles.buttonLabel,
						disabled && styles.disabledText,
					]}
				>
					Grab Trash
				</Text>
				<ControlButton
					onPress={() => onPress("GRAB_TRASH")}
					disabled={disabled}
					style={[styles.actionButton, styles.grabButton]}
					activeStyle={[
						styles.activeActionButton,
						styles.activeGrabButton,
					]}
					icon="robot-industrial"
				>
					<MaterialCommunityIcons
						name="robot-industrial"
						size={32}
						color={disabled ? Colors.textSecondary : "white"}
					/>
				</ControlButton>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "space-around",
		alignItems: "center",
		paddingVertical: 10,
	},
	buttonContainer: {
		alignItems: "center",
		marginVertical: 10,
	},
	buttonLabel: {
		marginBottom: 8,
		fontSize: 14,
		fontWeight: "bold",
		color: Colors.text,
	},
	disabledText: {
		color: Colors.textSecondary,
	},
	buttonRow: {
		marginVertical: 15,
	},
	actionButton: {
		width: 80,
		height: 80,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 40,
		backgroundColor: Colors.secondary,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
	},
	grabButton: {
		backgroundColor: Colors.warning,
	},
	activeActionButton: {
		backgroundColor: "#4A43D9", // Darker purple
		transform: [{ scale: 0.95 }],
	},
	activeGrabButton: {
		backgroundColor: "#E08500", // Darker orange
	},
});
