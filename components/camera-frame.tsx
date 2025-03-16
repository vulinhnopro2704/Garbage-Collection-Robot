import React, { useState } from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";

// Sample images for development
const SAMPLE_IMAGES = [
	"https://images.unsplash.com/photo-1604187351574-c75ca79f5807",
	"https://images.unsplash.com/photo-1605600659873-695133758fd2",
	"https://images.unsplash.com/photo-1569163139599-0cf9ce1a9c3f",
];

interface CameraFrameProps {
	disabled: boolean;
}

const CameraFrame: React.FC<CameraFrameProps> = ({ disabled }) => {
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [detectedImageUri, setDetectedImageUri] = useState<string | null>(
		null
	);
	const [isProcessing, setIsProcessing] = useState(false);

	// Mock taking a picture - use a random sample image
	const takePicture = async () => {
		if (disabled) return;

		const randomImage =
			SAMPLE_IMAGES[Math.floor(Math.random() * SAMPLE_IMAGES.length)];
		setImageUri(randomImage);
		setDetectedImageUri(null);
	};

	// Mock processing the image with YOLO
	const processImage = async () => {
		if (!imageUri || disabled) return;

		setIsProcessing(true);

		try {
			// Simulate processing delay
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Just use the same image as "detected" for demo purposes
			setDetectedImageUri(imageUri);
		} catch (error) {
			console.error("Error processing image:", error);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<View style={[styles.container, disabled && styles.disabled]}>
			{!imageUri ? (
				<View style={styles.cameraPlaceholder}>
					<Text style={styles.placeholderText}>Camera Preview</Text>
					<View style={styles.buttonContainer}>
						<TouchableOpacity
							style={styles.captureButton}
							onPress={takePicture}
							disabled={disabled}
						>
							<MaterialIcons
								name="camera"
								size={36}
								color="white"
							/>
						</TouchableOpacity>
					</View>
				</View>
			) : (
				<View style={styles.imageContainer}>
					<Image
						source={{ uri: detectedImageUri || imageUri }}
						style={styles.image}
						resizeMode="contain"
					/>

					<View style={styles.imageControlsContainer}>
						<TouchableOpacity
							style={styles.controlButton}
							onPress={() => {
								setImageUri(null);
								setDetectedImageUri(null);
							}}
							disabled={disabled}
						>
							<MaterialIcons
								name="refresh"
								size={24}
								color="white"
							/>
							<Text style={styles.buttonText}>New Photo</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={[
								styles.controlButton,
								isProcessing && styles.processingButton,
							]}
							onPress={processImage}
							disabled={
								isProcessing || !!detectedImageUri || disabled
							}
						>
							{isProcessing ? (
								<ActivityIndicator size="small" color="white" />
							) : (
								<>
									<MaterialIcons
										name={
											detectedImageUri
												? "check"
												: "search"
										}
										size={24}
										color="white"
									/>
									<Text style={styles.buttonText}>
										{detectedImageUri
											? "Detected"
											: "Detect"}
									</Text>
								</>
							)}
						</TouchableOpacity>
					</View>

					{detectedImageUri && (
						<View style={styles.detectionInfo}>
							<Text style={styles.detectionText}>
								Objects detected: Trash, Plastic bottle
							</Text>
						</View>
					)}
				</View>
			)}
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		borderRadius: 12,
		overflow: "hidden",
	},
	cameraPlaceholder: {
		flex: 1,
		backgroundColor: "#2c3e50",
		justifyContent: "center",
		alignItems: "center",
	},
	placeholderText: {
		color: "white",
		fontSize: 18,
		marginBottom: 100,
	},
	camera: {
		flex: 1,
		justifyContent: "flex-end",
	},
	buttonContainer: {
		position: "absolute",
		bottom: 20,
		width: "100%",
		flexDirection: "row",
		justifyContent: "center",
	},
	captureButton: {
		width: 70,
		height: 70,
		borderRadius: 35,
		backgroundColor: Colors.primary,
		justifyContent: "center",
		alignItems: "center",
		borderWidth: 2,
		borderColor: "white",
	},
	imageContainer: {
		flex: 1,
		backgroundColor: "#000",
		position: "relative",
	},
	image: {
		flex: 1,
	},
	imageControlsContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		flexDirection: "row",
		justifyContent: "space-around",
		padding: 15,
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	controlButton: {
		flexDirection: "row",
		alignItems: "center",
		backgroundColor: Colors.primary,
		paddingHorizontal: 15,
		paddingVertical: 8,
		borderRadius: 20,
	},
	processingButton: {
		backgroundColor: Colors.secondary,
	},
	buttonText: {
		color: "white",
		marginLeft: 5,
		fontWeight: "bold",
	},
	detectionInfo: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(0,0,0,0.5)",
		padding: 10,
	},
	detectionText: {
		color: "white",
		textAlign: "center",
	},
	disabled: {
		opacity: 0.5,
	},
});

export default CameraFrame;
