import React from "react";
import { StyleSheet, View } from "react-native";
import PowerToggle from "../ui/power-toggle";
import ModeSwitch from "../ui/mode-switch";

type props = {
	isAutoMode: boolean;
	isPoweredOn: boolean;
	handlePowerToggle: (isOn: boolean) => void;
	handleModeChange: (autoMode: boolean) => void;
};

export default function PowerAndModeToggle({
	handleModeChange,
	handlePowerToggle,
	isAutoMode,
	isPoweredOn,
}: props): React.ReactElement {
	return (
		<View style={styles.controlsRow}>
			<View style={styles.powerSection}>
				<PowerToggle isOn={isPoweredOn} onToggle={handlePowerToggle} />
			</View>

			<View style={styles.modeSection}>
				<ModeSwitch
					isAutoMode={isAutoMode}
					onModeChange={handleModeChange}
					disabled={!isPoweredOn}
				/>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
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
});
