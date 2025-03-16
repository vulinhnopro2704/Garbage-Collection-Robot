import React from "react";
import {
	View,
	Text,
	StyleSheet,
	TouchableOpacity,
	Animated,
} from "react-native";
import { Audio } from "expo-av";
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
	const [sound, setSound] = React.useState<Audio.Sound | null>(null);
	const slideAnim = React.useRef(
		new Animated.Value(isAutoMode ? 1 : 0)
	).current;

	React.useEffect(() => {
		// 	const loadSound = async () => {
		// 		// const { sound } = await Audio.Sound.createAsync(
		// 		// 	require("../assets/sounds/switch-mode.mp3")
		// 		// );
		// 		// setSound(sound);
		// 	};
		// 	loadSound();
		// 	return () => {
		// 		if (sound) {
		// 			sound.unloadAsync();
		// 		}
		// 	};
		// }, []);
		// React.useEffect(() => {
		// 	Animated.timing(slideAnim, {
		// 		toValue: isAutoMode ? 1 : 0,
		// 		duration: 300,
		// 		useNativeDriver: true,
		// 	}).start();
	}, [isAutoMode, slideAnim]);

	const playSound = async () => {
		// if (sound) {
		// 	await sound.replayAsync();
		// }
	};

	const handleToggle = async (autoMode: boolean) => {
		if (disabled) return;

		await playSound();
		onModeChange(autoMode);
	};

	const translateX = slideAnim.interpolate({
		inputRange: [0, 1],
		outputRange: [0, 120],
	});

	return (
		<View style={[styles.container, disabled && styles.disabled]}>
			<Animated.View
				style={[styles.slider, { transform: [{ translateX }] }]}
			/>

			<TouchableOpacity
				style={styles.option}
				onPress={() => handleToggle(false)}
				disabled={disabled}
			>
				<FontAwesome5
					name="gamepad"
					size={20}
					color={!isAutoMode ? "#fff" : "#666"}
				/>
				<Text
					style={[
						styles.optionText,
						!isAutoMode && styles.activeText,
					]}
				>
					Manual
				</Text>
			</TouchableOpacity>

			<TouchableOpacity
				style={styles.option}
				onPress={() => handleToggle(true)}
				disabled={disabled}
			>
				<FontAwesome5
					name="robot"
					size={20}
					color={isAutoMode ? "#fff" : "#666"}
				/>
				<Text
					style={[styles.optionText, isAutoMode && styles.activeText]}
				>
					Auto
				</Text>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		width: 240,
		height: 50,
		borderRadius: 25,
		flexDirection: "row",
		backgroundColor: "#f0f0f0",
		position: "relative",
		padding: 5,
	},
	slider: {
		position: "absolute",
		width: 120,
		height: 40,
		borderRadius: 20,
		backgroundColor: "#007AFF",
		top: 5,
		left: 5,
	},
	option: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		zIndex: 1,
	},
	optionText: {
		marginLeft: 5,
		fontWeight: "600",
		color: "#666",
	},
	activeText: {
		color: "#fff",
	},
	disabled: {
		opacity: 0.5,
	},
});

export default ModeSwitch;
