import React, { useEffect } from "react";
import { View, StyleSheet, TouchableOpacity, Animated } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface ModeSwitchProps {
	isAutoMode: boolean;
	onModeChange: (autoMode: boolean) => void;
	disabled?: boolean;
}

const ModeSwitch: React.FC<ModeSwitchProps> = ({
	isAutoMode,
	onModeChange,
	disabled = false,
}) => {
	const slideAnim = React.useRef(
		new Animated.Value(isAutoMode ? 1 : 0)
	).current;

	useEffect(() => {
		Animated.timing(slideAnim, {
			toValue: isAutoMode ? 1 : 0,
			duration: 300,
			useNativeDriver: true,
		}).start();
	}, [isAutoMode, slideAnim]);

	const handleToggle = (autoMode: boolean) => {
		if (disabled) return;
		onModeChange(autoMode);
	};

	// Animate on Y-axis instead of X-axis
	const translateY = slideAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 50], // Height of each option
	});

	return (
		<View style={[styles.container, disabled && styles.disabled]}>
			{/* Animated slider background */}
			<Animated.View
				style={[styles.slider, { transform: [{ translateY }] }]}
			/>

			{/* Manual mode button (top) */}
			<TouchableOpacity
				style={styles.option}
				onPress={() => handleToggle(false)}
				disabled={disabled}
				activeOpacity={0.7}
			>
				<FontAwesome5
					name="gamepad"
					size={24}
					color={!isAutoMode ? "#fff" : "#666"}
				/>
			</TouchableOpacity>

			{/* Auto mode button (bottom) */}
			<TouchableOpacity
				style={styles.option}
				onPress={() => handleToggle(true)}
				disabled={disabled}
				activeOpacity={0.7}
			>
				<FontAwesome5
					name="robot"
					size={24}
					color={isAutoMode ? "#fff" : "#666"}
				/>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 50,
		height: 100,
		borderRadius: 25,
		flexDirection: "column", // Changed from row to column
		backgroundColor: "#f0f0f0",
		position: "relative",
		padding: 5,
	},
	slider: {
		position: "absolute",
		width: 40,
		height: 40, // Square shape for the slider
		borderRadius: 20,
		backgroundColor: "#007AFF",
		top: 5,
		left: 5,
	},
	option: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		zIndex: 1,
	},
	disabled: {
		opacity: 0.5,
	},
});

export default ModeSwitch;
