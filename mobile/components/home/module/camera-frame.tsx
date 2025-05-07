import React, { useState, useEffect, useRef } from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	TouchableOpacity,
	ActivityIndicator,
	Alert,
	Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { Colors } from "@/constants/Colors";

interface CameraFrameProps {
	disabled: boolean;
	isFullscreen?: boolean;
}

const CameraFrame: React.FC<CameraFrameProps> = ({
	disabled,
	isFullscreen = false,
}) => {
	const [facing, setFacing] = useState<CameraType>("back");
	const [permission, requestPermission] = useCameraPermissions();
	const [imageUri, setImageUri] = useState<string | null>(null);
	const [detectedImageUri, setDetectedImageUri] = useState<string | null>(
		null
	);
	const [isProcessing, setIsProcessing] = useState(false);
	const [detectionResult, setDetectionResult] = useState<any>(null);
	const cameraRef = useRef<any>(null);

	const toggleCameraFacing = () => {
		setFacing((current) => (current === "back" ? "front" : "back"));
	};

	// Take a picture using the camera
	const takePicture = async () => {
		if (disabled || !cameraRef.current) return;

		try {
			const photo = await cameraRef.current.takePictureAsync();

			setImageUri(photo.uri);
			setDetectedImageUri(null);
			setDetectionResult(null);
		} catch (error) {
			console.error("Error taking picture:", error);
			Alert.alert("Error", "Failed to take picture. Please try again.");
		}
	};

	// Process the image with the detection API
	const processImage = async () => {
		if (!imageUri || disabled) return;

		setIsProcessing(true);

		try {
			// Create a form data object to send the image
			const formData = new FormData();
			formData.append("image", {
				uri: imageUri,
				type: "image/jpeg",
				name: "upload.jpg",
			} as any);

			// Make API request to the detection server
			const response = await fetch(
				"https://server.course4u.one/detect/",
				{
					method: "POST",
					body: formData,
					headers: {
						Accept: "application/json",
						"Content-Type": "multipart/form-data",
					},
				}
			);

			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const data = await response.json();
			console.log("Detection response:", data);

			// Set the processed image URL and detection results
			setDetectedImageUri(data.processed_image_url);
			setDetectionResult(data);
		} catch (error) {
			console.error("Error processing image:", error);
			Alert.alert("Error", "Failed to process image. Please try again.");
		} finally {
			setIsProcessing(false);
		}
	};

	// Parse and display detection results
	const renderDetectionInfo = () => {
		if (!detectionResult) return null;

		try {
			const results = JSON.parse(detectionResult.results);
			return (
				<View style={styles.detectionInfo}>
					{results.map((item: any, index: number) => (
						<Text key={index} style={styles.detectionText}>
							Detected: {item.name} (Confidence:{" "}
							{(item.confidence * 100).toFixed(1)}%)
						</Text>
					))}
				</View>
			);
		} catch (e) {
			return (
				<View style={styles.detectionInfo}>
					<Text style={styles.detectionText}>Objects detected</Text>
				</View>
			);
		}
	};

	if (!permission) {
		// Camera permissions are still loading
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.permissionText}>
					Requesting camera permission...
				</Text>
			</View>
		);
	}

	if (!permission.granted) {
		// Camera permissions are not granted yet
		return (
			<View style={[styles.container, styles.centered]}>
				<Text style={styles.permissionText}>
					We need your permission to show the camera
				</Text>
				<TouchableOpacity
					style={styles.permissionButton}
					onPress={requestPermission}
				>
					<Text style={styles.permissionButtonText}>
						Grant Permission
					</Text>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View
			style={[
				styles.container,
				isFullscreen && styles.fullscreenContainer,
				disabled && styles.disabled,
			]}
		>
			{!imageUri ? (
				<View style={styles.cameraContainer}>
					<CameraView
						ref={cameraRef}
						style={styles.camera}
						facing={facing}
						mute={false}
						responsiveOrientationWhenOrientationLocked
					>
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

							<TouchableOpacity
								style={styles.flipButton}
								onPress={toggleCameraFacing}
							>
								<MaterialIcons
									name="flip-camera-android"
									size={30}
									color="white"
								/>
							</TouchableOpacity>
						</View>
					</CameraView>
				</View>
			) : (
				<View style={styles.imageContainer}>
					<Image
						source={{ uri: detectedImageUri || imageUri }}
						style={styles.image}
						resizeMode={isFullscreen ? "cover" : "contain"}
					/>

					<View style={styles.imageControlsContainer}>
						<TouchableOpacity
							style={styles.controlButton}
							onPress={() => {
								setImageUri(null);
								setDetectedImageUri(null);
								setDetectionResult(null);
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

					{detectedImageUri && renderDetectionInfo()}
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
	fullscreenContainer: {
		width: Dimensions.get("window").width,
		height: Dimensions.get("window").height,
		borderRadius: 0,
	},
	centered: {
		justifyContent: "center",
		alignItems: "center",
	},
	cameraContainer: {
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
	permissionText: {
		color: "white",
		fontSize: 18,
		marginBottom: 20,
	},
	permissionButton: {
		backgroundColor: Colors.primary,
		paddingVertical: 10,
		paddingHorizontal: 20,
		borderRadius: 8,
	},
	permissionButtonText: {
		color: "white",
		fontSize: 16,
		fontWeight: "bold",
	},
	placeholderText: {
		color: "white",
		fontSize: 18,
		marginBottom: 100,
	},
	camera: {
		flex: 1,
	},
	buttonContainer: {
		flex: 1,
		flexDirection: "row",
		backgroundColor: "transparent",
		justifyContent: "center",
		alignItems: "flex-end",
		marginBottom: 20,
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
	flipButton: {
		position: "absolute",
		right: 20,
		bottom: 20,
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: "rgba(0,0,0,0.5)",
		justifyContent: "center",
		alignItems: "center",
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
		fontSize: 14,
		marginBottom: 4,
	},
	disabled: {
		opacity: 0.5,
	},
});

export default CameraFrame;
