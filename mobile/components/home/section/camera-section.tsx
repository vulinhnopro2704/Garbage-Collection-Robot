import React, { useState } from "react";
import { StyleSheet, View, TouchableOpacity, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import CameraFrame from "../module/camera-frame";
import { Colors } from "@/constants/Colors";
import { useRobotStore } from "@/store/robotStore";
import BinStatusDisplay from "../ui/bin-status-display";

export default function CameraSection(): React.ReactElement {
	const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
	const { isPoweredOn, binStatus } = useRobotStore();

	const toggleFullscreen = () => {
		setIsFullscreen(!isFullscreen);
	};

	return (
		<>
			<View style={[styles.section, styles.cameraSection]}>
				<View style={styles.cameraContainer}>
					<CameraFrame disabled={!isPoweredOn} isFullscreen={false} />

					{/* Fullscreen button */}
					<TouchableOpacity
						style={styles.fullscreenButton}
						onPress={toggleFullscreen}
						disabled={!isPoweredOn}
					>
						<MaterialIcons
							name={
								isFullscreen ? "fullscreen-exit" : "fullscreen"
							}
							size={24}
							color="white"
						/>
					</TouchableOpacity>
				</View>

				{/* Display bin status if available */}
				{binStatus && <BinStatusDisplay />}
			</View>

			{/* Fullscreen modal */}
			<Modal
				animationType="fade"
				transparent={false}
				visible={isFullscreen}
				onRequestClose={toggleFullscreen}
			>
				<View style={styles.fullscreenContainer}>
					<CameraFrame disabled={!isPoweredOn} isFullscreen={true} />

					<TouchableOpacity
						style={styles.closeButton}
						onPress={toggleFullscreen}
					>
						<MaterialIcons name="close" size={30} color="white" />
					</TouchableOpacity>

					{/* Display bin status in fullscreen too */}
					{binStatus && (
						<View style={styles.fullscreenStatusContainer}>
							<BinStatusDisplay />
						</View>
					)}
				</View>
			</Modal>
		</>
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
	cameraContainer: {
		position: "relative",
		flex: 1,
		borderRadius: 12,
		overflow: "hidden",
	},
	fullscreenButton: {
		position: "absolute",
		top: 10,
		right: 10,
		backgroundColor: "rgba(0,0,0,0.5)",
		padding: 8,
		borderRadius: 20,
		zIndex: 10,
	},
	fullscreenContainer: {
		flex: 1,
		backgroundColor: "#000",
		position: "relative",
	},
	closeButton: {
		position: "absolute",
		top: 40,
		right: 15,
		backgroundColor: "rgba(0,0,0,0.5)",
		padding: 8,
		borderRadius: 20,
	},
	fullscreenStatusContainer: {
		position: "absolute",
		bottom: 20,
		left: 10,
		right: 10,
	},
});
