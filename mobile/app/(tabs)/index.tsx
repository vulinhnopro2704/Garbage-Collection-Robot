import React, { useEffect } from "react";
import {
	View,
	StyleSheet,
	SafeAreaView,
	StatusBar,
	TouchableOpacity,
} from "react-native";
import { Audio } from "expo-av";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import { Colors } from "@/constants/Colors";
import Header from "@/components/home/section/header";
import CameraSection from "@/components/home/section/camera-section";
import ControlButtonSection from "@/components/home/section/control-button-section";
import ConnectionStatusIndicator from "@/components/home/ui/connection-status";
import { useSocket } from "@/hooks/useSocket";
import { RobotCommand } from "@/constants/command";
import { useRobotStore } from "@/store/robotStore";

export default function ControlScreen(): React.ReactElement {
	const router = useRouter();
	const [sound, setSound] = React.useState<Audio.Sound | null>(null);

	// Get robot state from Zustand store
	const { isPoweredOn, isAutoMode, speed } = useRobotStore();

	const { connect, sendCommand } = useSocket();

	async function playButtonSound(): Promise<void> {
		try {
			const { sound } = await Audio.Sound.createAsync(
				require("@/assets/sounds/button-press.mp3")
			);
			setSound(sound);
			await sound.playAsync();
		} catch (error) {
			console.log("Sound couldn't be played", error);
		}
	}

	useEffect(() => {
		return sound
			? () => {
					sound.unloadAsync();
			  }
			: undefined;
	}, [sound]);

	useEffect(() => {
		// Attempt to connect to the WebSocket server when the component mounts
		connect();
	}, [connect]);

	const handleCommand = (command: RobotCommand): void => {
		if (!isPoweredOn) return;
		playButtonSound().catch(console.error);
		sendCommand(command, speed);
	};

	const navigateToSettings = () => {
		router.push("/setting");
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" />

			{/* Header with settings button */}
			<View style={styles.headerContainer}>
				<Header />
				<TouchableOpacity
					style={styles.settingsButton}
					onPress={navigateToSettings}
				>
					<MaterialIcons
						name="settings"
						size={28}
						color={Colors.text}
					/>
				</TouchableOpacity>
			</View>

			{/* Camera section with fullscreen capability */}
			<CameraSection />

			{/* Control buttons section */}
			<ControlButtonSection
				handleCommand={handleCommand}
				isAutoMode={isAutoMode}
				isPoweredOn={isPoweredOn}
			/>

			{/* Connection status indicator at the bottom */}
			<View style={styles.statusBar}>
				<ConnectionStatusIndicator />
			</View>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
		padding: 16,
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 8,
	},
	settingsButton: {
		padding: 8,
		borderRadius: 20,
		backgroundColor: Colors.cardBackground,
	},
	statusBar: {
		marginTop: 8,
		paddingVertical: 8,
	},
});
