import React, { useState, useEffect } from "react";
import {
	StyleSheet,
	View,
	TouchableOpacity,
	Text,
	Animated,
	Easing,
} from "react-native";
import { Audio } from "expo-av";
import { FontAwesome5 } from "@expo/vector-icons";

interface PowerToggleButtonProps {
	initialState?: boolean;
	onToggle?: (isOn: boolean) => void;
	size?: number;
}

const PowerToggleButton: React.FC<PowerToggleButtonProps> = ({
	initialState = false,
	onToggle,
	size = 60,
}) => {
	const [isOn, setIsOn] = useState(initialState);
	const [sound, setSound] = useState<Audio.Sound | null>(null);
	const scaleAnim = useState(new Animated.Value(1))[0];
	const rotateAnim = useState(new Animated.Value(0))[0];

	useEffect(() => {
		return sound
			? () => {
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	const loadSound = async () => {
		// const { sound } = await Audio.Sound.createAsync(
		// 	require("../assets/sounds/power-toggle.mp3"),
		// 	{ shouldPlay: false }
		// );
		// setSound(sound);
	};

	useEffect(() => {
		loadSound();
	}, []);

	const playSound = async () => {
		// if (sound) {
		// 	await sound.replayAsync();
		// }
	};

	const handlePress = async () => {
		// Play animation
		Animated.sequence([
			Animated.timing(scaleAnim, {
				toValue: 0.8,
				duration: 100,
				useNativeDriver: true,
				easing: Easing.ease,
			}),
			Animated.timing(scaleAnim, {
				toValue: 1,
				duration: 100,
				useNativeDriver: true,
				easing: Easing.bounce,
			}),
		]).start();

		Animated.timing(rotateAnim, {
			toValue: isOn ? 0 : 1,
			duration: 300,
			useNativeDriver: true,
		}).start();

		// Play sound
		await playSound();

		// Toggle state
		const newState = !isOn;
		setIsOn(newState);

		// Call callback if provided
		if (onToggle) {
			onToggle(newState);
		}
	};

	const rotateInterpolation = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "360deg"],
	});

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={handlePress}
			style={styles.container}
		>
			<Animated.View
				style={[
					styles.button,
					{
						width: size,
						height: size,
						backgroundColor: isOn ? "#4cd964" : "#e0e0e0",
						transform: [
							{ scale: scaleAnim },
							{ rotate: rotateInterpolation },
						],
					},
				]}
			>
				<FontAwesome5
					name="power-off"
					size={size * 0.5}
					color={isOn ? "#fff" : "#666"}
				/>
			</Animated.View>
			<Text style={[styles.label, { color: isOn ? "#4cd964" : "#666" }]}>
				{isOn ? "ON" : "OFF"}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		alignItems: "center",
		justifyContent: "center",
	},
	button: {
		borderRadius: 100,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
	},
	label: {
		marginTop: 8,
		fontSize: 14,
		fontWeight: "bold",
	},
});

export default PowerToggleButton;
