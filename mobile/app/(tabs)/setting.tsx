import React from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
// import { useBluetoothConnection } from "@/hooks/use-bluetooth-connection";
import { Colors } from "@/constants/Colors";
import Header from "@/components/setting/header";
import ConnectionSettings from "@/components/setting/section/connection-setting";
import NotificationSettings from "@/components/setting/section/notification-setting";
import RecentDetections from "@/components/setting/section/recent-detection";
import AboutSection from "@/components/setting/section/about-section";

export default function Setting() {
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [soundEnabled, setSoundEnabled] = useState(true);
	const [vibrationEnabled, setVibrationEnabled] = useState(true);
	const [wifiName, setWifiName] = useState("");
	const [wifiPassword, setWifiPassword] = useState("");
	const [isConnectingWifi, setIsConnectingWifi] = useState(false);
	const [showWifiSettings, setShowWifiSettings] = useState(false);

	// const { isConnected, isScanning, connectDevice, disconnect } =
	// 	useBluetoothConnection();

	// const handleBluetoothToggle = async () => {
	// 	if (isConnected) {
	// 		await disconnect();
	// 	} else {
	// 		await connectDevice();
	// 	}
	// };

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
			<Header title="Settings" />

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				<ConnectionSettings />
				<NotificationSettings />
				<RecentDetections />
				<AboutSection />

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
	scrollView: {
		flex: 1,
	},
	bottomPadding: {
		height: 40,
	},
});
