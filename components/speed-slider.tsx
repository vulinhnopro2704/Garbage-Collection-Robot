import React, { useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Slider from "@react-native-community/slider";
import { FontAwesome5 } from "@expo/vector-icons";
import { Audio } from "expo-av";

interface SpeedSliderProps {
	speed: number;
	onSpeedChange: (speed: number) => void;
	onValueChangeEnd?: (speed: number) => void;
	disabled?: boolean;
}

const SpeedSlider: React.FC<SpeedSliderProps> = ({
	speed,
	onSpeedChange,
	onValueChangeEnd,
	disabled = false,
}) => {
	const [isSliding, setIsSliding] = useState(false);
	const [sound, setSound] = React.useState<Audio.Sound | null>(null);
	const pulseAnim = React.useRef(new Animated.Value(1)).current;

	React.useEffect(() => {
		// const loadSound = async () => {
		// 	const { sound } = await Audio.Sound.createAsync(
		// 		require("../assets/sounds/slider-tick.mp3")
		// 	);
		// 	setSound(sound);
		// };
		// loadSound();
		// return () => {
		// 	if (sound) {
		// 		sound.unloadAsync();
		// 	}
		// };
	}, []);

	React.useEffect(() => {
		if (isSliding) {
			startPulseAnimation();
		} else {
			pulseAnim.setValue(1);
			Animated.timing(pulseAnim, {
				toValue: 1,
				duration: 0,
				useNativeDriver: true,
			}).stop();
		}
	}, [isSliding]);

	const startPulseAnimation = () => {
		Animated.loop(
			Animated.sequence([
				Animated.timing(pulseAnim, {
					toValue: 1.2,
					duration: 300,
					useNativeDriver: true,
				}),
				Animated.timing(pulseAnim, {
					toValue: 1,
					duration: 300,
					useNativeDriver: true,
				}),
			])
		).start();
	};

	const playTickSound = async () => {
		if (sound) {
			try {
				await sound.setPositionAsync(0);
				await sound.playAsync();
			} catch (error) {
				console.error("Failed to play sound", error);
			}
		}
	};

	const handleValueChange = (value: number) => {
		const roundedValue = Math.round(value);
		if (Math.abs(roundedValue - speed) >= 5) {
			playTickSound();
		}
		onSpeedChange(roundedValue);
	};

	// Calculate the color based on speed value
	const getSpeedColor = () => {
		if (speed < 30) return "#4CD964"; // Green
		if (speed < 70) return "#FF9500"; // Orange
		return "#FF3B30"; // Red
	};

	const iconName =
		speed < 30
			? "tachometer-alt"
			: speed < 70
			? "tachometer-alt"
			: "tachometer-alt";

	return (
		<View style={[styles.container, disabled && styles.disabled]}>
			<View style={styles.header}>
				<Animated.View
					style={[
						styles.iconContainer,
						{ transform: [{ scale: pulseAnim }] },
					]}
				>
					<FontAwesome5
						name={iconName}
						size={20}
						color={getSpeedColor()}
					/>
				</Animated.View>
				<Text style={[styles.speedValue, { color: getSpeedColor() }]}>
					{speed}%
				</Text>
			</View>

			<Slider
				style={styles.slider}
				minimumValue={0}
				maximumValue={100}
				step={1}
				value={speed}
				minimumTrackTintColor={getSpeedColor()}
				maximumTrackTintColor="#D1D1D6"
				thumbTintColor={getSpeedColor()}
				disabled={disabled}
				onValueChange={handleValueChange}
				onSlidingStart={() => setIsSliding(true)}
				onSlidingComplete={(value) => {
					setIsSliding(false);
					if (onValueChangeEnd) {
						onValueChangeEnd(Math.round(value));
					}
				}}
			/>

			<View style={styles.labels}>
				<Text style={styles.labelText}>Slow</Text>
				<Text style={styles.labelText}>Fast</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 16,
		backgroundColor: "#F2F2F7",
		borderRadius: 12,
	},
	disabled: {
		opacity: 0.5,
	},
	header: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 8,
	},
	iconContainer: {
		width: 40,
		height: 40,
		borderRadius: 20,
		backgroundColor: "rgba(0,0,0,0.05)",
		justifyContent: "center",
		alignItems: "center",
		marginRight: 10,
	},
	speedValue: {
		fontSize: 24,
		fontWeight: "bold",
	},
	slider: {
		width: "100%",
		height: 40,
	},
	labels: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingHorizontal: 10,
	},
	labelText: {
		fontSize: 12,
		color: "#8E8E93",
	},
});

export default SpeedSlider;
