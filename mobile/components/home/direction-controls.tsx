import React from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { RobotCommand } from "@/constants/command";

interface DirectionControlsProps {
	onPress: (command: RobotCommand) => void;
	disabled?: boolean;
}

const DirectionButton: React.FC<{
	direction: string;
	iconName: string;
	scaleAnim: Animated.Value;
	onPressIn: (direction: string) => void;
	onPressOut: () => void;
	disabled: boolean;
}> = ({ direction, iconName, scaleAnim, onPressIn, onPressOut, disabled }) => (
	<Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
		<TouchableOpacity
			style={[styles.button, styles.directionButton]}
			onPressIn={() => onPressIn(direction)}
			onPressOut={onPressOut}
			disabled={disabled}
			activeOpacity={0.7}
		>
			<FontAwesome5 name={iconName} size={24} color="#fff" />
		</TouchableOpacity>
	</Animated.View>
);

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

	const handlePressIn = (direction: string) => {
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

	const handlePressOut = () => {
		onPress("STOP");
	};

	return (
		<View style={styles.container}>
			<View style={styles.directionPad}>
				{/* Up Button */}
				<DirectionButton
					direction="up"
					iconName="chevron-up"
					scaleAnim={scaleAnims.up}
					onPressIn={handlePressIn}
					onPressOut={handlePressOut}
					disabled={disabled}
				/>

				{/* Middle Row (Left, Right) */}
				<View style={styles.buttonRow}>
					<DirectionButton
						direction="left"
						iconName="chevron-left"
						scaleAnim={scaleAnims.left}
						onPressIn={handlePressIn}
						onPressOut={handlePressOut}
						disabled={disabled}
					/>

					<View style={styles.centerSpace} />

					<DirectionButton
						direction="right"
						iconName="chevron-right"
						scaleAnim={scaleAnims.right}
						onPressIn={handlePressIn}
						onPressOut={handlePressOut}
						disabled={disabled}
					/>
				</View>

				{/* Down Button */}
				<DirectionButton
					direction="down"
					iconName="chevron-down"
					scaleAnim={scaleAnims.down}
					onPressIn={handlePressIn}
					onPressOut={handlePressOut}
					disabled={disabled}
				/>
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
