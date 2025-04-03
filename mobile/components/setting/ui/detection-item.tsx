import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "@/constants/Colors";

interface Detection {
	id: string;
	uri: string;
	detectedObjects: string[];
	timestamp: string;
}

interface DetectionItemProps {
	detection: Detection;
}

const DetectionItem: React.FC<DetectionItemProps> = ({ detection }) => {
	return (
		<View style={styles.detectionItem}>
			<Image
				source={{ uri: detection.uri }}
				style={styles.detectionImage}
			/>
			<View style={styles.detectionInfo}>
				<Text style={styles.detectionObjects}>
					{detection.detectedObjects.join(", ")}
				</Text>
				<Text style={styles.detectionTimestamp}>
					{detection.timestamp}
				</Text>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	detectionItem: {
		flexDirection: "row",
		marginBottom: 12,
		backgroundColor: "rgba(0,0,0,0.02)",
		borderRadius: 8,
		overflow: "hidden",
	},
	detectionImage: {
		width: 80,
		height: 80,
	},
	detectionInfo: {
		flex: 1,
		padding: 10,
		justifyContent: "center",
	},
	detectionObjects: {
		fontSize: 14,
		fontWeight: "500",
		color: Colors.text,
	},
	detectionTimestamp: {
		fontSize: 12,
		color: Colors.textSecondary,
		marginTop: 4,
	},
});

export default DetectionItem;
