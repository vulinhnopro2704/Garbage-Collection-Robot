import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	StyleSheet,
	ScrollView,
	Switch,
	TouchableOpacity,
	Image,
	SafeAreaView,
	TextInput,
	ActivityIndicator,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { useBluetoothConnection } from "@/hooks/use-bluetooth-connection";
import { Colors } from "@/constants/Colors";

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

interface SettingItemProps {
	icon: React.ReactNode;
	title: string;
	description?: string;
	rightElement?: React.ReactNode;
	onPress?: () => void;
}

const SettingItem: React.FC<SettingItemProps> = ({
	icon,
	title,
	description,
	rightElement,
	onPress,
}) => (
	<TouchableOpacity
		style={styles.settingItem}
		onPress={onPress}
		disabled={!onPress}
	>
		<View style={styles.settingIconContainer}>{icon}</View>
		<View style={styles.settingContentContainer}>
			<Text style={styles.settingTitle}>{title}</Text>
			{description && (
				<Text style={styles.settingDescription}>{description}</Text>
			)}
		</View>
		<View style={styles.settingRightElement}>
			{rightElement || (
				<MaterialIcons
					name="chevron-right"
					size={24}
					color={Colors.textSecondary}
				/>
			)}
		</View>
	</TouchableOpacity>
);

export default function Setting() {
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [soundEnabled, setSoundEnabled] = useState(true);
	const [vibrationEnabled, setVibrationEnabled] = useState(true);
	const [wifiName, setWifiName] = useState("");
	const [wifiPassword, setWifiPassword] = useState("");
	const [isConnectingWifi, setIsConnectingWifi] = useState(false);
	const [showWifiSettings, setShowWifiSettings] = useState(false);

	const { isConnected, isScanning, connectDevice, disconnect } =
		useBluetoothConnection();

	const handleBluetoothToggle = async () => {
		if (isConnected) {
			await disconnect();
		} else {
			await connectDevice();
		}
	};

	const handleWifiConnect = () => {
		if (!wifiName || !wifiPassword) return;

		setIsConnectingWifi(true);
		// Simulate connection process
		setTimeout(() => {
			setIsConnectingWifi(false);
			// Show a success message or handle as needed
		}, 2000);
	};

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="dark" />

			<View style={styles.header}>
				<Text style={styles.headerTitle}>Settings</Text>
			</View>

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Connection Settings Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Connection Settings</Text>

					{/* Bluetooth Setting */}
					<SettingItem
						icon={
							<FontAwesome5
								name="bluetooth-b"
								size={20}
								color={
									isConnected
										? Colors.primary
										: Colors.textSecondary
								}
							/>
						}
						title="Bluetooth Connection"
						description={
							isConnected
								? "Connected to Trash Collector"
								: "Tap to connect to your device"
						}
						rightElement={
							isScanning ? (
								<ActivityIndicator
									size="small"
									color={Colors.primary}
								/>
							) : (
								<Switch
									value={isConnected}
									onValueChange={handleBluetoothToggle}
									trackColor={{
										false: "#767577",
										true: Colors.primary,
									}}
									thumbColor="#f4f3f4"
								/>
							)
						}
						onPress={handleBluetoothToggle}
					/>

					{/* WiFi Setting */}
					<SettingItem
						icon={
							<Ionicons
								name="wifi"
								size={22}
								color={Colors.textSecondary}
							/>
						}
						title="WiFi Connection"
						description="Configure device WiFi settings"
						onPress={() => setShowWifiSettings(!showWifiSettings)}
					/>

					{/* WiFi Configuration Form */}
					{showWifiSettings && (
						<View style={styles.wifiSettings}>
							<TextInput
								style={styles.input}
								placeholder="WiFi Network Name (SSID)"
								value={wifiName}
								onChangeText={setWifiName}
							/>
							<TextInput
								style={styles.input}
								placeholder="Password"
								value={wifiPassword}
								onChangeText={setWifiPassword}
								secureTextEntry
							/>
							<TouchableOpacity
								style={[
									styles.wifiConnectButton,
									(!wifiName || !wifiPassword) &&
										styles.disabledButton,
								]}
								onPress={handleWifiConnect}
								disabled={
									!wifiName ||
									!wifiPassword ||
									isConnectingWifi
								}
							>
								{isConnectingWifi ? (
									<ActivityIndicator
										size="small"
										color="#fff"
									/>
								) : (
									<Text style={styles.wifiConnectButtonText}>
										Connect
									</Text>
								)}
							</TouchableOpacity>
						</View>
					)}
				</View>

				{/* Notification Settings Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Notifications</Text>

					<SettingItem
						icon={
							<Ionicons
								name="notifications"
								size={22}
								color={
									notificationsEnabled
										? Colors.primary
										: Colors.textSecondary
								}
							/>
						}
						title="Push Notifications"
						description="Receive alerts about trash detections"
						rightElement={
							<Switch
								value={notificationsEnabled}
								onValueChange={setNotificationsEnabled}
								trackColor={{
									false: "#767577",
									true: Colors.primary,
								}}
								thumbColor="#f4f3f4"
							/>
						}
					/>

					<SettingItem
						icon={
							<Ionicons
								name="volume-medium"
								size={22}
								color={
									soundEnabled
										? Colors.primary
										: Colors.textSecondary
								}
							/>
						}
						title="Sound Effects"
						description="Play sounds for button press and alerts"
						rightElement={
							<Switch
								value={soundEnabled}
								onValueChange={setSoundEnabled}
								trackColor={{
									false: "#767577",
									true: Colors.primary,
								}}
								thumbColor="#f4f3f4"
							/>
						}
					/>

					<SettingItem
						icon={
							<Ionicons
								name="accessibility"
								size={22}
								color={
									vibrationEnabled
										? Colors.primary
										: Colors.textSecondary
								}
							/>
						}
						title="Vibration"
						description="Vibrate on notifications and actions"
						rightElement={
							<Switch
								value={vibrationEnabled}
								onValueChange={setVibrationEnabled}
								trackColor={{
									false: "#767577",
									true: Colors.primary,
								}}
								thumbColor="#f4f3f4"
							/>
						}
					/>
				</View>

				{/* Recent Detections Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>Recent Detections</Text>

					<View style={styles.recentDetections}>
						{RECENT_DETECTIONS.map((detection) => (
							<View
								key={detection.id}
								style={styles.detectionItem}
							>
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
				</View>

				{/* About Section */}
				<View style={styles.section}>
					<Text style={styles.sectionTitle}>About</Text>

					<SettingItem
						icon={
							<MaterialIcons
								name="info"
								size={22}
								color={Colors.textSecondary}
							/>
						}
						title="App Information"
						description="Version 1.0.0"
					/>

					<SettingItem
						icon={
							<MaterialIcons
								name="help"
								size={22}
								color={Colors.textSecondary}
							/>
						}
						title="Help & Support"
					/>
				</View>

				{/* Add extra space at bottom for scrolling comfort */}
				<View style={styles.bottomPadding} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	header: {
		padding: 16,
		paddingBottom: 8,
		backgroundColor: Colors.cardBackground,
		borderBottomWidth: 1,
		borderBottomColor: "rgba(0,0,0,0.05)",
	},
	headerTitle: {
		fontSize: 24,
		fontWeight: "bold",
		color: Colors.text,
	},
	scrollView: {
		flex: 1,
	},
	section: {
		backgroundColor: Colors.cardBackground,
		marginHorizontal: 16,
		marginTop: 16,
		padding: 16,
		borderRadius: 12,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 2,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "600",
		color: Colors.text,
		marginBottom: 12,
	},
	settingItem: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 16,
		paddingVertical: 8,
	},
	settingIconContainer: {
		width: 40,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0,0,0,0.05)",
		borderRadius: 20,
		marginRight: 12,
	},
	settingContentContainer: {
		flex: 1,
	},
	settingTitle: {
		fontSize: 16,
		fontWeight: "500",
		color: Colors.text,
	},
	settingDescription: {
		fontSize: 14,
		color: Colors.textSecondary,
		marginTop: 2,
	},
	settingRightElement: {
		marginLeft: 8,
	},
	wifiSettings: {
		paddingTop: 8,
		paddingBottom: 8,
	},
	input: {
		backgroundColor: "rgba(0,0,0,0.05)",
		height: 40,
		paddingHorizontal: 12,
		borderRadius: 8,
		marginBottom: 12,
	},
	wifiConnectButton: {
		backgroundColor: Colors.primary,
		height: 40,
		justifyContent: "center",
		alignItems: "center",
		borderRadius: 8,
	},
	disabledButton: {
		backgroundColor: Colors.buttonDisabled,
	},
	wifiConnectButtonText: {
		color: "#fff",
		fontWeight: "500",
	},
	recentDetections: {
		marginTop: 8,
	},
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
	bottomPadding: {
		height: 40,
	},
});
