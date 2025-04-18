import React, { useState, useEffect } from "react";
import { View, StyleSheet, SafeAreaView, StatusBar } from "react-native";

import { Audio } from "expo-av";
import { Colors } from "@/constants/Colors";
import Header from "@/components/home/section/header";
import PowerAndModeToggle from "@/components/home/section/power-and-mode-toggle";
import CameraSection from "@/components/home/section/camera-section";
import ControlButtonSection from "@/components/home/section/control-button-section";
import SpeedSliderSection from "@/components/home/section/speed-slider-section";
import { useSocket } from "@/hooks/useSocket";
import SpeedSlider from "@/components/home/ui/speed-slider";
import { RobotCommand, SpeedCommand } from "@/constants/command";

export default function ControlScreen(): React.ReactElement {
	const [isAutoMode, setIsAutoMode] = useState<boolean>(false);
	const [speed, setSpeed] = useState<number>(50);
	const [isPoweredOn, setIsPoweredOn] = useState<boolean>(false);
	const [sound, setSound] = useState<Audio.Sound | null>(null);

	const { isConnected, connect, sendCommand } = useSocket();

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
		if (!isConnected) {
			connect();
		}
	}, [connect, isConnected]);

	useEffect(() => {
		if (!isConnected) {
			connect();
		}
	}, [isConnected, connect]);

	const handleCommand = (command: RobotCommand): void => {
		if (!isPoweredOn) return;
		playButtonSound().catch(console.error);
		sendCommand(command, speed);
	};

	const handleModeChange = (autoMode: boolean): void => {
		setIsAutoMode(autoMode);
		playButtonSound().catch(console.error);
		sendCommand(autoMode ? "AUTO_MODE" : "MANUAL_MODE", speed);
	};

	const handlePowerToggle = (isOn: boolean): void => {
		setIsPoweredOn(isOn);
		playButtonSound().catch(console.error);
		sendCommand(isOn ? "POWER_ON" : "POWER_OFF", speed);
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar barStyle="light-content" />
			<Header />
			{/* Power and Mode controls in a single row */}
			<PowerAndModeToggle
				handleModeChange={handleModeChange}
				handlePowerToggle={handlePowerToggle}
				isAutoMode={isAutoMode}
				isPoweredOn={isPoweredOn}
			/>
			{/* Camera frame and detection section */}
			<CameraSection isPoweredOn />
			{/* Control buttons section */}
			<ControlButtonSection
				handleCommand={handleCommand}
				isAutoMode={isAutoMode}
				isPoweredOn={isPoweredOn}
			/>

			{/* Speed slider */}
			<SpeedSliderSection isPoweredOn setSpeed={setSpeed} speed={speed} />
			<View style={[styles.section, styles.speedSection]}>
				<SpeedSlider
					speed={speed}
					onSpeedChange={setSpeed}
					disabled={!isPoweredOn}
					onValueChangeEnd={(value: number) =>
						sendCommand(`SPEED_${value}` as SpeedCommand, speed)
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
