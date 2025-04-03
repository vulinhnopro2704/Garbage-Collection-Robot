import React from "react";
import { StyleSheet, View } from "react-native";
import SpeedSlider from "../ui/speed-slider";
import { Colors } from "@/constants/Colors";
type props = {
	speed: number;
	setSpeed: (speed: number) => void;
	isPoweredOn: boolean;
};
export default function SpeedSliderSection({
	isPoweredOn,
	setSpeed,
	speed,
}: props): React.ReactElement {
	return (
		<View style={[styles.section, styles.speedSection]}>
			<SpeedSlider
				speed={speed}
				onSpeedChange={setSpeed}
				disabled={!isPoweredOn}
				onValueChangeEnd={(value: number) => {
					// sendCommand(`SPEED_${value}` as SpeedCommand);
				}}
			/>
		</View>
	);
}

const styles = StyleSheet.create({
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
	speedSection: {
		marginTop: 8,
		paddingVertical: 16,
	},
	disabledSection: {
		opacity: 0.7,
	},
});
