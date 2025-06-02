import React, { useEffect } from "react";
import {
	View,
	StyleSheet,
	SafeAreaView,
	StatusBar,
	TouchableOpacity,
	Text,
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

export default function ControlScreen(): React.ReactElement {
	const router = useRouter();
	const [sound, setSound] = React.useState<Audio.Sound | null>(null);

	// Get all robot state and functions from useSocket
	const {
		// Connection states
		connect,
		sendCommand,
		isConnected,
		isConnecting,
		error,
		reconnectAttempt,

		// Robot states
		isPoweredOn,
		isAutoMode,
		speed,
	} = useSocket();

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

	// Function to manually trigger reconnection
	const handleManualReconnect = () => {
		connect();
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" />

			{/* Connection status banner at the top */}
			<View
				style={[
					styles.connectionBanner,
					isConnected
						? styles.connectedBanner
						: styles.disconnectedBanner,
				]}
			>
				<Text style={styles.connectionText}>
					{isConnected
						? "Connected to Robot"
						: isConnecting
						? `Connecting... (Attempt ${reconnectAttempt})`
						: "Disconnected"}
				</Text>
				{!isConnected && !isConnecting && (
					<TouchableOpacity
						style={styles.reconnectButton}
						onPress={handleManualReconnect}
					>
						<Text style={styles.reconnectText}>Reconnect</Text>
					</TouchableOpacity>
				)}
			</View>

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
				<ConnectionStatusIndicator
					isConnected={isConnected}
					isConnecting={isConnecting}
					error={error}
					reconnectAttempt={reconnectAttempt}
				/>
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
	connectionBanner: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		padding: 8,
		marginBottom: 8,
		borderRadius: 8,
	},
	connectedBanner: {
		backgroundColor: "rgba(0, 255, 0, 0.2)",
	},
	disconnectedBanner: {
		backgroundColor: "rgba(255, 0, 0, 0.2)",
	},
	connectionText: {
		fontWeight: "bold",
		color: Colors.text,
	},
	reconnectButton: {
		backgroundColor: Colors.lightGray,
		paddingHorizontal: 10,
		paddingVertical: 5,
		borderRadius: 5,
	},
	reconnectText: {
		color: "white",
		fontWeight: "bold",
	},
});
