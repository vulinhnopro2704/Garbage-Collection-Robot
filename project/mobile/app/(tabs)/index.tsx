import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, SafeAreaView, StatusBar } from "react-native";
import { router } from "expo-router";
import { Audio } from "expo-av";
import ConnectionStatus from "@/components/connection-status";
import { useBluetoothConnection } from "@/hooks/use-bluetooth-connection";
import SettingsButton from "@/components/setting-button";
import ModeSwitch from "@/components/mode-switch";
import CameraFrame from "@/components/camera-frame";
import DirectionControls from "@/components/direction-controls";
import PowerToggle from "@/components/power-toggle";
import SpeedSlider from "@/components/speed-slider";
import { ActionControls } from "@/components/action-control";
import { Colors } from "@/constants/Colors";

// Command types to ensure type safety when sending commands
type DirectionCommand = "FORWARD" | "BACKWARD" | "LEFT" | "RIGHT" | "STOP";
type ActionCommand = "GRAB_TRASH" | "ROTATE_BIN";
type ModeCommand = "AUTO_MODE" | "MANUAL_MODE";
type PowerCommand = "POWER_ON" | "POWER_OFF";
type SpeedCommand = `SPEED_${number}`;
export type RobotCommand =
	| DirectionCommand
	| ActionCommand
	| ModeCommand
	| PowerCommand
	| SpeedCommand;

export default function ControlScreen(): React.ReactElement {
	const [isAutoMode, setIsAutoMode] = useState<boolean>(false);
	const [speed, setSpeed] = useState<number>(50);
	const [isPoweredOn, setIsPoweredOn] = useState<boolean>(false);
	const { isConnected, connectDevice, sendCommand } =
		useBluetoothConnection();
	const [sound, setSound] = useState<Audio.Sound | null>(null);

	useEffect(() => {
		// Try to connect automatically when component mounts
		connectDevice().catch(console.error);
	}, [connectDevice]);

	// Sound effect for button presses
	async function playButtonSound(): Promise<void> {
		try {
			const { sound } = await Audio.Sound.createAsync(
				require("../../assets/sounds/button-press.mp3")
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

	const handleCommand = (command: RobotCommand): void => {
		if (!isPoweredOn) return;
		playButtonSound().catch(console.error);
		sendCommand(command);
	};

	const handleModeChange = (autoMode: boolean): void => {
		setIsAutoMode(autoMode);
		playButtonSound().catch(console.error);
		sendCommand(autoMode ? "AUTO_MODE" : "MANUAL_MODE");
	};

	const handlePowerToggle = (isOn: boolean): void => {
		setIsPoweredOn(isOn);
		playButtonSound().catch(console.error);
		sendCommand(isOn ? "POWER_ON" : "POWER_OFF");
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" />

			{/* Header with connection status and settings */}
			<View style={styles.header}>
				<ConnectionStatus isConnected={isConnected} />
				<Text style={styles.title}>Control</Text>
				<SettingsButton
					onPress={() => router.push("/(tabs)/setting")}
				/>
			</View>

			{/* Power and Mode controls in a single row */}
			<View style={styles.controlsRow}>
				<View style={styles.powerSection}>
					<PowerToggle
						isOn={isPoweredOn}
						onToggle={handlePowerToggle}
					/>
				</View>

				<View style={styles.modeSection}>
					<ModeSwitch
						isAutoMode={isAutoMode}
						onModeChange={handleModeChange}
						disabled={!isPoweredOn}
					/>
				</View>
			</View>

			{/* Camera frame and detection section */}
			<View style={[styles.section, styles.cameraSection]}>
				<CameraFrame disabled={!isPoweredOn} />
			</View>

			{/* Control buttons section */}
			<View
				style={[
					styles.section,
					styles.controlsSection,
					isAutoMode && styles.disabledSection,
				]}
			>
				{/* Direction controls on the left */}
				<View style={styles.directionControlsContainer}>
					<DirectionControls
						onPress={handleCommand}
						disabled={!isPoweredOn || isAutoMode}
					/>
				</View>

				{/* Action controls on the right */}
				<View style={styles.actionControlsContainer}>
					<ActionControls
						onPress={handleCommand}
						disabled={!isPoweredOn || isAutoMode}
					/>
				</View>
			</View>

			{/* Speed slider */}
			<View style={[styles.section, styles.speedSection]}>
				<SpeedSlider
					speed={speed}
					onSpeedChange={setSpeed}
					disabled={!isPoweredOn}
					onValueChangeEnd={(value: number) =>
						sendCommand(`SPEED_${value}` as SpeedCommand)
					}
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
	header: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
		paddingVertical: 4,
	},
	title: {
		fontSize: 20,
		fontWeight: "bold",
		color: Colors.text,
	},
	controlsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginBottom: 10,
	},
	powerSection: {
		flex: 1,
		alignItems: "center",
		paddingHorizontal: 5,
		maxWidth: "50%",
	},
	modeSection: {
		flex: 1,
		alignItems: "center",
		paddingHorizontal: 5,
		maxWidth: "50%",
	},
	section: {
		marginVertical: 8,
		padding: 12,
		borderRadius: 16,
		backgroundColor: Colors.cardBackground,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 3,
	},
	cameraSection: {
		flex: 3,
		minHeight: 180,
	},
	controlsSection: {
		flex: 4,
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 16,
		paddingHorizontal: 8,
		minHeight: 220,
	},
	directionControlsContainer: {
		flex: 1,
		marginRight: 8,
	},
	actionControlsContainer: {
		flex: 1,
		marginLeft: 8,
	},
	speedSection: {
		marginTop: 8,
		paddingVertical: 16,
	},
	disabledSection: {
		opacity: 0.7,
	},
});
