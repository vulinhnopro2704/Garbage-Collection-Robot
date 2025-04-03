import React, { useState } from "react";
import {
	View,
	TextInput,
	StyleSheet,
	TouchableOpacity,
	Text,
	ActivityIndicator,
	Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import SettingItem from "./setting-item";

const WifiSettings = () => {
	const [wifiName, setWifiName] = useState("");
	const [wifiPassword, setWifiPassword] = useState("");
	const [isConnectingWifi, setIsConnectingWifi] = useState(false);
	const [showWifiSettings, setShowWifiSettings] = useState(false);

	// Handle WiFi connection
	const handleWifiConnect = () => {
		if (!wifiName || !wifiPassword) return;

		setIsConnectingWifi(true);
		// Simulate connection process
		setTimeout(() => {
			setIsConnectingWifi(false);
			Alert.alert("Success", "Wi-Fi settings updated");
		}, 2000);
	};

	return (
		<>
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
							!wifiName || !wifiPassword || isConnectingWifi
						}
					>
						{isConnectingWifi ? (
							<ActivityIndicator size="small" color="#fff" />
						) : (
							<Text style={styles.wifiConnectButtonText}>
								Connect
							</Text>
						)}
					</TouchableOpacity>
				</View>
			)}
		</>
	);
};

const styles = StyleSheet.create({
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
});

export default WifiSettings;
