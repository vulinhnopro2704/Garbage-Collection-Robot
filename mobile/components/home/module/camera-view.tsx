import React, { useState } from "react";
import {
	StyleSheet,
	View,
	Image,
	TouchableOpacity,
	Text,
	ActivityIndicator,
} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

interface CameraViewProps {
	onCapture?: () => Promise<string>; // Returns image URI
	onProcess?: (imageUri: string) => Promise<string>; // Process image with YOLO and return result URI
}

const CameraView: React.FC<CameraViewProps> = ({ onCapture, onProcess }) => {
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [processedImageUri, setProcessedImageUri] = useState<string | null>(
		null
	);
	const [isCapturing, setIsCapturing] = useState(false);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleCapture = async () => {
		try {
			setError(null);
			setIsCapturing(true);

			if (onCapture) {
				const uri = await onCapture();
				setImageUri(uri);
				setProcessedImageUri(null); // Clear processed image
			}
		} catch (e) {
			setError("Failed to capture image");
			console.error(e);
		} finally {
			setIsCapturing(false);
		}
	};

	const handleProcess = async () => {
		if (!imageUri || !onProcess) return;

		try {
			setError(null);
			setIsProcessing(true);

			const resultUri = await onProcess(imageUri);
			setProcessedImageUri(resultUri);
		} catch (e) {
			setError("Failed to process image");
			console.error(e);
		} finally {
			setIsProcessing(false);
		}
	};

	return (
		<View style={styles.container}>
			<View style={styles.imageContainer}>
				{isCapturing ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#3498db" />
						<Text style={styles.loadingText}>Capturing...</Text>
					</View>
				) : isProcessing ? (
					<View style={styles.loadingContainer}>
						<ActivityIndicator size="large" color="#3498db" />
						<Text style={styles.loadingText}>
							Processing with YOLO...
						</Text>
					</View>
				) : processedImageUri ? (
					<Image
						source={{ uri: processedImageUri }}
						style={styles.image}
						resizeMode="contain"
					/>
				) : imageUri ? (
					<Image
						source={{ uri: imageUri }}
						style={styles.image}
						resizeMode="contain"
					/>
				) : (
					<View style={styles.placeholder}>
						<FontAwesome5 name="camera" size={50} color="#cccccc" />
						<Text style={styles.placeholderText}>
							No image captured
						</Text>
					</View>
				)}

				{error && (
					<View style={styles.errorContainer}>
						<Text style={styles.errorText}>{error}</Text>
					</View>
				)}
			</View>

			<View style={styles.buttonContainer}>
				<TouchableOpacity
					style={[styles.button, styles.captureButton]}
					onPress={handleCapture}
					disabled={isCapturing || isProcessing}
				>
					<FontAwesome5 name="camera" size={24} color="#fff" />
					<Text style={styles.buttonText}>Capture</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={[
						styles.button,
						styles.processButton,
						(!imageUri || isCapturing || isProcessing) &&
							styles.disabledButton,
					]}
					onPress={handleProcess}
					disabled={!imageUri || isCapturing || isProcessing}
				>
					<FontAwesome5 name="robot" size={24} color="#fff" />
					<Text style={styles.buttonText}>Process</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	container: {
		backgroundColor: "#f8f8f8",
		borderRadius: 12,
		overflow: "hidden",
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		shadowRadius: 4,
		elevation: 5,
	},
	imageContainer: {
		height: 220,
		backgroundColor: "#000",
		justifyContent: "center",
		alignItems: "center",
	},
	image: {
		width: "100%",
		height: "100%",
	},
	placeholder: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	placeholderText: {
		marginTop: 10,
		color: "#cccccc",
		fontSize: 16,
	},
	buttonContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		padding: 12,
		backgroundColor: "#f8f8f8",
	},
	button: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 12,
		borderRadius: 8,
		flex: 1,
		marginHorizontal: 5,
	},
	captureButton: {
		backgroundColor: "#3498db",
	},
	processButton: {
		backgroundColor: "#2ecc71",
	},
	disabledButton: {
		backgroundColor: "#cccccc",
	},
	buttonText: {
		color: "white",
		fontWeight: "bold",
		marginLeft: 8,
	},
	loadingContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	loadingText: {
		marginTop: 10,
		color: "#3498db",
		fontSize: 16,
		fontWeight: "bold",
	},
	errorContainer: {
		position: "absolute",
		bottom: 0,
		left: 0,
		right: 0,
		backgroundColor: "rgba(255, 59, 48, 0.8)",
		padding: 8,
	},
	errorText: {
		color: "white",
		textAlign: "center",
		fontWeight: "bold",
	},
});

export default CameraView;
