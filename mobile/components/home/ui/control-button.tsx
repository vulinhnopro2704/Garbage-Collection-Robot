import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, Animated, Easing } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";

interface ControlButtonProps {
	icon: string;
	color?: string;
	size?: number;
	onPress?: () => void;
	onPressIn?: () => void;
	onPressOut?: () => void;
	disabled?: boolean;
	style: object;
	activeStyle: object;
	children: React.ReactNode;
}

const ControlButton: React.FC<ControlButtonProps> = ({
	icon,
	color = "#3498db",
	size = 60,
	onPress,
	onPressIn,
	onPressOut,
	disabled = false,
}) => {
	const scaleAnim = useState(new Animated.Value(1))[0];
	const [sound, setSound] = useState<Audio.Sound | null>(null);

	React.useEffect(() => {
		loadSound();
		return sound
			? () => {
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	const loadSound = async () => {
		try {
			const { sound: buttonSound } = await Audio.Sound.createAsync(
				require("../../../assets/sounds/button-press.mp3")
			);
			setSound(buttonSound);
		} catch (error) {
			console.log("Failed to load sound", error);
		}
	};

	const playSound = async () => {
		if (sound) {
			try {
				await sound.replayAsync();
			} catch (error) {
				console.log("Failed to play sound", error);
			}
		}
	};

	const handlePressIn = () => {
		playSound();
		Animated.timing(scaleAnim, {
			toValue: 0.9,
			duration: 100,
			useNativeDriver: true,
			easing: Easing.ease,
		}).start();

		if (onPressIn) {
			onPressIn();
		}
	};

	const handlePressOut = () => {
		Animated.timing(scaleAnim, {
			toValue: 1,
			duration: 200,
			useNativeDriver: true,
			easing: Easing.bounce,
		}).start();

		if (onPressOut) {
			onPressOut();
		}
	};

	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={onPress}
			onPressIn={handlePressIn}
			onPressOut={handlePressOut}
			disabled={disabled}
			style={styles.container}
		>
			<Animated.View
				style={[
					styles.button,
					{
						width: size,
						height: size,
						backgroundColor: disabled ? "#cccccc" : color,
						transform: [{ scale: scaleAnim }],
					},
				]}
			>
				<FontAwesome5 name={icon} size={size * 0.4} color="#ffffff" />
			</Animated.View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		margin: 8,
	},
	button: {
		borderRadius: 12,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.3,
		shadowRadius: 3,
		elevation: 5,
	},
});

export default ControlButton;
