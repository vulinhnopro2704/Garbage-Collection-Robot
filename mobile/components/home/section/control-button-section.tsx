import React from "react";
import { StyleSheet, View } from "react-native";
import DirectionControls from "../direction-controls";
import { ActionControls } from "../ui/action-control";
import { Colors } from "@/constants/Colors";
import { RobotCommand } from "@/app/(tabs)";

type Props = {
	isPoweredOn: boolean;
	isAutoMode: boolean;
	handleCommand: (command: RobotCommand) => void;
};

export default function ControlButtonSection({
	handleCommand,
	isAutoMode,
	isPoweredOn,
}: Props): React.ReactElement {
	return (
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
	disabledSection: {
		opacity: 0.7,
	},
});
