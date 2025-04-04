import React, { useState, useCallback } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import Slider from "@react-native-community/slider";
import { FontAwesome5 } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

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
	const pulseAnim = React.useRef(new Animated.Value(1)).current;
	const startPulseAnimation = useCallback(() => {
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
	}, [pulseAnim]);
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
	}, [isSliding, pulseAnim, startPulseAnimation]);

	const handleValueChange = useCallback(
		(value: number) => {
			onSpeedChange(Math.round(value));
		},
		[onSpeedChange]
	);

	const handleSlidingComplete = useCallback(
		(value: number) => {
			setIsSliding(false);
			if (onValueChangeEnd) {
				onValueChangeEnd(Math.round(value));
			}
		},
		[onValueChangeEnd]
	);

	// Calculate the color based on speed value
	const getSpeedColor = useCallback(() => {
		if (speed < 30) return Colors.success; // Green
		if (speed < 70) return Colors.warning; // Orange
		return Colors.error; // Red
	}, [speed]);

	return (
		<View style={[styles.container, disabled && styles.disabled]}>
			<View style={styles.sliderContainer}>
				<Animated.View
					style={[
						styles.iconContainer,
						{ transform: [{ scale: pulseAnim }] },
					]}
				>
					<FontAwesome5
						name="tachometer-alt"
						size={14}
						color={getSpeedColor()}
					/>
				</Animated.View>

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
					onSlidingComplete={handleSlidingComplete}
				/>

				<Text style={[styles.speedValue, { color: getSpeedColor() }]}>
					{speed}%
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 10,
		backgroundColor: "rgba(242, 242, 247, 0.7)",
		borderRadius: 10,
		height: 50,
	},
	disabled: {
		opacity: 0.5,
	},
	sliderContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
	},
	iconContainer: {
		width: 28,
		height: 28,
		borderRadius: 14,
		backgroundColor: "rgba(0,0,0,0.05)",
		justifyContent: "center",
		alignItems: "center",
	},
	speedValue: {
		fontSize: 16,
		fontWeight: "bold",
		width: 40,
		textAlign: "right",
	},
	slider: {
		flex: 1,
		height: 40,
		marginHorizontal: 8,
	},
});

export default SpeedSlider;
