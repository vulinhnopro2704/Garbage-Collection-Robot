import React, { useEffect } from "react";
import { View, Text, StyleSheet, Animated, Easing } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface ConnectionStatusProps {
	isConnected: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isConnected }) => {
	const blinkAnim = React.useRef(new Animated.Value(0)).current;

	useEffect(() => {
		if (!isConnected) {
			// Create blinking animation for disconnected state
			Animated.loop(
				Animated.sequence([
					Animated.timing(blinkAnim, {
						toValue: 1,
						duration: 500,
						useNativeDriver: true,
						easing: Easing.ease,
					}),
					Animated.timing(blinkAnim, {
						toValue: 0,
						duration: 500,
						useNativeDriver: true,
						easing: Easing.ease,
					}),
				])
			).start();
		} else {
			// Stop animation if connected
			blinkAnim.setValue(1);
			blinkAnim.stopAnimation();
		}
	}, [isConnected, blinkAnim]);

	return (
		<View style={styles.container}>
			<Animated.View style={{ opacity: isConnected ? 1 : blinkAnim }}>
				<FontAwesome5
					name={isConnected ? "bluetooth" : "bluetooth-b"}
					size={20}
					color={isConnected ? "#4CD964" : "#FF3B30"}
				/>
			</Animated.View>
			<Text
				style={[
					styles.statusText,
					{ color: isConnected ? "#4CD964" : "#FF3B30" },
				]}
			>
				{isConnected ? "Connected" : "Disconnected"}
			</Text>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		padding: 8,
	},
	statusText: {
		marginLeft: 8,
		fontWeight: "600",
		fontSize: 14,
	},
});

export default ConnectionStatus;
