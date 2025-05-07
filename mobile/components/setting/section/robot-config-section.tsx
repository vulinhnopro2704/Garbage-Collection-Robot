import React, { useEffect } from "react";
import { View, StyleSheet, Text } from "react-native";
import { Audio } from "expo-av";
import { Colors } from "@/constants/Colors";
import PowerToggle from "@/components/home/ui/power-toggle";
import ModeSwitch from "@/components/home/ui/mode-switch";
import SpeedSlider from "@/components/home/ui/speed-slider";
import SectionContainer from "./section-container";
import { useSocket } from "@/hooks/useSocket";

interface RobotConfigSectionProps {
	isPoweredOn: boolean;
	setIsPoweredOn: (isOn: boolean) => void;
	isAutoMode: boolean;
	setIsAutoMode: (isAuto: boolean) => void;
	speed: number;
	setSpeed: (speed: number) => void;
}

const RobotConfigSection: React.FC<RobotConfigSectionProps> = ({
	isPoweredOn,
	setIsPoweredOn,
	isAutoMode,
	setIsAutoMode,
	speed,
	setSpeed,
}) => {
	const [sound, setSound] = React.useState<Audio.Sound | null>(null);
	const { sendCommand } = useSocket();

	async function playPowerSound(): Promise<void> {
		try {
			const { sound } = await Audio.Sound.createAsync(
				require("@/assets/sounds/power-toggle.mp3")
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

	const handlePowerToggle = () => {
		const newPowerState = !isPoweredOn;
		setIsPoweredOn(newPowerState);
		playPowerSound();

		if (newPowerState) {
			sendCommand("POWER_ON", speed);
		} else {
			sendCommand("POWER_OFF", speed);
		}
	};

	const handleModeToggle = () => {
		const newMode = !isAutoMode;
		setIsAutoMode(newMode);

		if (newMode) {
			sendCommand("AUTO_MODE", speed);
		} else {
			sendCommand("MANUAL_MODE", speed);
		}
	};

	const handleSpeedChange = (newSpeed: number) => {
		setSpeed(newSpeed);
		sendCommand(`SPEED_${newSpeed}` as any, newSpeed);
	};

	return (
		<SectionContainer title="Robot Configuration">
			<View style={styles.rowContainer}>
				<View style={styles.column}>
					<Text style={styles.label}>Power</Text>
					<PowerToggle
						isOn={isPoweredOn}
						onToggle={handlePowerToggle}
					/>
				</View>

				<View style={styles.column}>
					<Text style={styles.label}>Mode</Text>
					<ModeSwitch
						isAutoMode={isAutoMode}
						onModeChange={handleModeToggle}
						disabled={!isPoweredOn}
					/>
				</View>
			</View>

			<View style={styles.sliderContainer}>
				<Text style={styles.label}>Speed Control</Text>
				<SpeedSlider
					speed={speed}
					onSpeedChange={handleSpeedChange}
					disabled={!isPoweredOn}
				/>
			</View>
		</SectionContainer>
	);
};

const styles = StyleSheet.create({
	rowContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginBottom: 20,
	},
	column: {
		flex: 1,
		alignItems: "center",
	},
	label: {
		fontSize: 16,
		fontWeight: "600",
		marginBottom: 8,
		color: Colors.text,
	},
	sliderContainer: {
		marginTop: 8,
	},
});

export default RobotConfigSection;
