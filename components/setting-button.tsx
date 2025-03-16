import React from "react";
import { StyleSheet, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface SettingsButtonProps {
	onPress: () => void;
	size?: number;
}

const SettingsButton: React.FC<SettingsButtonProps> = ({
	onPress,
	size = 24,
}) => {
	const rotateAnim = React.useRef(new Animated.Value(0)).current;

	const handlePress = () => {
		Animated.sequence([
			Animated.timing(rotateAnim, {
				toValue: 1,
				duration: 300,
				useNativeDriver: true,
			}),
			Animated.timing(rotateAnim, {
				toValue: 0,
				duration: 0,
				useNativeDriver: true,
			}),
		]).start();

		onPress();
	};

	const rotate = rotateAnim.interpolate({
		inputRange: [0, 1],
		outputRange: ["0deg", "180deg"],
	});

	return (
		<TouchableOpacity
			style={styles.container}
			onPress={handlePress}
			activeOpacity={0.7}
		>
			<Animated.View style={{ transform: [{ rotate }] }}>
				<Ionicons name="settings-outline" size={size} color="#007AFF" />
			</Animated.View>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	container: {
		padding: 8,
		borderRadius: 20,
	},
});

export default SettingsButton;
