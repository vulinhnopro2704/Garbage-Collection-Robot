import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import DetectionItem from "../ui/detection-item";
import SectionContainer from "./section-container";

// Sample recent detection images
const RECENT_DETECTIONS = [
	{
		id: "1",
		uri: "https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
		detectedObjects: ["Plastic Bottle", "Paper"],
		timestamp: "2023-03-15 14:30",
	},
	{
		id: "2",
		uri: "https://images.unsplash.com/photo-1605600659873-695133758fd2",
		detectedObjects: ["Metal Can", "Food Waste"],
		timestamp: "2023-03-14 09:15",
	},
	{
		id: "3",
		uri: "https://images.unsplash.com/photo-1569163139599-0cf9ce1a9c3f",
		detectedObjects: ["Cardboard", "Glass"],
		timestamp: "2023-03-13 16:45",
	},
];

const RecentDetections = () => {
	return (
		<SectionContainer title="Recent Detections">
			<View style={styles.recentDetections}>
				{RECENT_DETECTIONS.map((detection) => (
					<DetectionItem key={detection.id} detection={detection} />
				))}

				<TouchableOpacity style={styles.viewAllButton}>
					<Text style={styles.viewAllButtonText}>
						View All History
					</Text>
					<MaterialIcons
						name="arrow-forward"
						size={18}
						color={Colors.primary}
					/>
				</TouchableOpacity>
			</View>
		</SectionContainer>
	);
};

const styles = StyleSheet.create({
	recentDetections: {
		marginTop: 8,
	},
	viewAllButton: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		paddingVertical: 12,
	},
	viewAllButtonText: {
		fontSize: 14,
		color: Colors.primary,
		marginRight: 4,
	},
});

export default RecentDetections;
