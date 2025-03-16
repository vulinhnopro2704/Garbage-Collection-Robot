import React from "react";
import {
	View,
	StyleSheet,
	TouchableOpacity,
	Text,
	Animated,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { RobotCommand } from "@/app/(tabs)/control";

interface DirectionControlsProps {
	onPress: (command: RobotCommand) => void;
	disabled?: boolean;
}

const DirectionControls: React.FC<DirectionControlsProps> = ({
	onPress,
	disabled = false,
}) => {
	// Create animated values for each button
	const scaleAnims = {
		up: React.useRef(new Animated.Value(1)).current,
		right: React.useRef(new Animated.Value(1)).current,
		down: React.useRef(new Animated.Value(1)).current,
		left: React.useRef(new Animated.Value(1)).current,
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

	const handlePress = (direction: string) => {
		if (disabled) return;

		switch (direction) {
			case "up":
				animatePress("up");
				onPress("FORWARD");
				break;
			case "right":
				animatePress("right");
				onPress("RIGHT");
				break;
			case "down":
				animatePress("down");
				onPress("BACKWARD");
				break;
			case "left":
				animatePress("left");
				onPress("LEFT");
				break;
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.directionPad}>
				{/* Up Button */}
				<Animated.View
					style={[
						styles.buttonRow,
						{ transform: [{ scale: scaleAnims.up }] },
					]}
				>
					<TouchableOpacity
						style={[styles.button, styles.directionButton]}
						onPress={() => handlePress("up")}
						disabled={disabled}
						activeOpacity={0.7}
					>
						<FontAwesome5
							name="chevron-up"
							size={24}
							color="#fff"
						/>
					</TouchableOpacity>
				</Animated.View>

				{/* Middle Row (Left, Right) */}
				<View style={styles.buttonRow}>
					<Animated.View
						style={{ transform: [{ scale: scaleAnims.left }] }}
					>
						<TouchableOpacity
							style={[styles.button, styles.directionButton]}
							onPress={() => handlePress("left")}
							disabled={disabled}
							activeOpacity={0.7}
						>
							<FontAwesome5
								name="chevron-left"
								size={24}
								color="#fff"
							/>
						</TouchableOpacity>
					</Animated.View>

					<View style={styles.centerSpace} />

					<Animated.View
						style={{ transform: [{ scale: scaleAnims.right }] }}
					>
						<TouchableOpacity
							style={[styles.button, styles.directionButton]}
							onPress={() => handlePress("right")}
							disabled={disabled}
							activeOpacity={0.7}
						>
							<FontAwesome5
								name="chevron-right"
								size={24}
								color="#fff"
							/>
						</TouchableOpacity>
					</Animated.View>
				</View>

				{/* Down Button */}
				<Animated.View
					style={[
						styles.buttonRow,
						{ transform: [{ scale: scaleAnims.down }] },
					]}
				>
					<TouchableOpacity
						style={[styles.button, styles.directionButton]}
						onPress={() => handlePress("down")}
						disabled={disabled}
						activeOpacity={0.7}
					>
						<FontAwesome5
							name="chevron-down"
							size={24}
							color="#fff"
						/>
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
	directionPad: {
		width: 200,
		height: 200,
		justifyContent: "center",
		alignItems: "center",
	},
	buttonRow: {
		flexDirection: "row",
		justifyContent: "center",
		marginVertical: 8,
	},
	button: {
		width: 60,
		height: 60,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 30,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
	},
	directionButton: {
		backgroundColor: "#007AFF",
	},
	centerSpace: {
		width: 60,
	},
});

export default DirectionControls;
