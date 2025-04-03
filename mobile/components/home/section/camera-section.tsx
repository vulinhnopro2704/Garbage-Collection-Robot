import React from "react";
import { StyleSheet, View } from "react-native";
import CameraFrame from "../camera-frame";
import { Colors } from "@/constants/Colors";

type props = {
	isPoweredOn: boolean;
};

export default function CameraSection({
	isPoweredOn,
}: props): React.ReactElement {
	return (
		<View style={[styles.section, styles.cameraSection]}>
			<CameraFrame disabled={!isPoweredOn} />
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
	cameraSection: {
		flex: 3,
		minHeight: 180,
	},
});
