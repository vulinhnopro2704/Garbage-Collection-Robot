import React from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import PowerToggleButton from "./power-toggle-button";
import { Colors } from "@/constants/Colors";

interface PowerToggleProps {
	isOn: boolean;
	onToggle: (isOn: boolean) => void;
}

const PowerToggle: React.FC<PowerToggleProps> = ({ isOn, onToggle }) => {
	// Create animated value for glow effect
	const glowAnim = React.useRef(new Animated.Value(isOn ? 1 : 0)).current;

	React.useEffect(() => {
		// Animate glow effect when power state changes
		Animated.timing(glowAnim, {
			toValue: isOn ? 1 : 0,
			duration: 500,
			useNativeDriver: false, // Using false as we're animating non-transform/opacity properties
		}).start();
	}, [isOn, glowAnim]);

	// Interpolate animation values
	const glowOpacity = glowAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 0.7],
	});

	const statusColor = glowAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [Colors.error, Colors.success],
	});

	return (
		<View style={styles.container}>
			<Text style={styles.label}>POWER</Text>

			<View style={styles.toggleContainer}>
				<Animated.View
					style={[
						styles.glow,
						{
							opacity: glowOpacity,
							backgroundColor: statusColor,
						},
					]}
				/>
				<PowerToggleButton
					size={70}
					initialState={isOn}
					onToggle={onToggle}
				/>
			</View>

			<Animated.Text style={[styles.statusText, { color: statusColor }]}>
				{isOn ? "SYSTEM ONLINE" : "SYSTEM OFFLINE"}
			</Animated.Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
		padding: 10,
	},
	label: {
		fontSize: 16,
		fontWeight: "bold",
		color: Colors.textSecondary,
		marginBottom: 5,
	},
	toggleContainer: {
		position: "relative",
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 10,
	},
	glow: {
		position: "absolute",
		width: 100,
		height: 100,
		borderRadius: 50,
		backgroundColor: Colors.success,
		zIndex: -1,
	},
	statusText: {
		fontSize: 14,
		fontWeight: "bold",
		marginTop: 8,
		letterSpacing: 1,
	},
});

export default PowerToggle;
