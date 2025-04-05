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

interface ActionControlsProps {
	onPress: (command: RobotCommand) => void;
	disabled?: boolean;
}

export const ActionControls: React.FC<ActionControlsProps> = ({
	onPress,
	disabled = false,
}) => {
	// Create animated values for each button
	const scaleAnims = {
		grab: React.useRef(new Animated.Value(1)).current,
		rotate: React.useRef(new Animated.Value(1)).current,
	};

	const animatePress = (key: keyof typeof scaleAnims) => {
		Animated.sequence([
			Animated.timing(scaleAnims[key], {
				toValue: 0.9,
				duration: 100,
				useNativeDriver: true,
			}),
			Animated.timing(scaleAnims[key], {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
			}),
		]).start();
	};

	const handlePress = (action: string) => {
		if (disabled) return;

		switch (action) {
			case "grab":
				animatePress("grab");
				onPress("GRAB_TRASH");
				break;
			case "rotate":
				animatePress("rotate");
				onPress("ROTATE_BIN");
				break;
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.actionButtons}>
				{/* Grab Button */}
				<Animated.View
					style={{
						transform: [{ scale: scaleAnims.grab }],
						marginBottom: 20,
					}}
				>
					<TouchableOpacity
						style={[
							styles.button,
							styles.grabButton,
							disabled && styles.disabled,
						]}
						onPress={() => handlePress("grab")}
						disabled={disabled}
						activeOpacity={0.7}
					>
						<FontAwesome5 name="hand-rock" size={24} color="#fff" />
						<Text style={styles.buttonText}>Grab</Text>
					</TouchableOpacity>
				</Animated.View>

				{/* Rotate Button */}
				<Animated.View
					style={{ transform: [{ scale: scaleAnims.rotate }] }}
				>
					<TouchableOpacity
						style={[
							styles.button,
							styles.rotateButton,
							disabled && styles.disabled,
						]}
						onPress={() => handlePress("rotate")}
						disabled={disabled}
						activeOpacity={0.7}
					>
						<FontAwesome5 name="sync-alt" size={24} color="#fff" />
						<Text style={styles.buttonText}>Rotate</Text>
					</TouchableOpacity>
				</Animated.View>
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
	rotateButton: {
		backgroundColor: "#5856D6",
	},
	buttonText: {
		color: "#fff",
		fontWeight: "bold",
		marginTop: 8,
	},
	disabled: {
		opacity: 0.5,
	},
});
