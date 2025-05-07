import React from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Animated,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { RobotCommand } from "@/constants/command";
import RotateBinButton from "./rotate-bin-button";

interface ActionControlsProps {
	onPress: (command: RobotCommand) => void;
	disabled?: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
	onPress,
	disabled = false,
}) => {
	// Create animated values for grab button
	const grabAnim = React.useRef(new Animated.Value(1)).current;

	const animatePress = () => {
		Animated.sequence([
			Animated.timing(grabAnim, {
				toValue: 0.9,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(grabAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();
	};

	const handleGrab = () => {
		if (disabled) return;

		animatePress();
		onPress("GRAB_TRASH");
	};

	return (
		<View style={styles.container}>
			<View style={styles.actionButtons}>
				{/* Grab Button */}
				<Animated.View
					style={{
						transform: [{ scale: grabAnim }],
						marginBottom: 20,
					}}
				>
					<TouchableOpacity
						style={[
							styles.button,
							styles.grabButton,
							disabled && styles.disabled,
						]}
						onPress={handleGrab}
						disabled={disabled}
						activeOpacity={0.7}
					>
						<FontAwesome5 name="hand-rock" size={24} color="#fff" />
						<Text style={styles.buttonText}>Grab</Text>
					</TouchableOpacity>
				</Animated.View>

				{/* Use the new RotateBinButton component */}
				<View style={styles.rotateContainer}>
					<RotateBinButton disabled={disabled} />
				</View>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	actionButtons: {
		justifyContent: "center",
		alignItems: "center",
	},
	button: {
		width: 100,
		height: 100,
		borderRadius: 50,
		justifyContent: "center",
		alignItems: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,
		elevation: 6,
	},
	grabButton: {
		backgroundColor: "#FF9500",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		marginTop: 8,
	},
	disabled: {
		opacity: 0.5,
	},
	rotateContainer: {
		minWidth: 120,
	},
});
