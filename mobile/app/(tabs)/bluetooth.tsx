import React, { useState } from "react";
import {
	View,
	Text,
	FlatList,
	TouchableOpacity,
	StyleSheet,
	ActivityIndicator,
	TextInput,
	Button,
	Alert,
} from "react-native";
import { useBluetoothConnection } from "../../hooks/use-bluetooth-connection";
import { StatusBar } from "expo-status-bar";
import { SafeAreaView } from "react-native-safe-area-context";

export default function BluetoothScreen() {
	const {
		devices,
		isScanning,
		scanForDevices,
		stopScan,
		isConnected,
		isConnecting,
		connectDevice,
		disconnect,
		sendCommand,
		receivedData,
		error,
		connectedDevice,
		isBluetoothAvailable,
	} = useBluetoothConnection();

	const [command, setCommand] = useState("");

	// If Bluetooth is not available (in Expo Go), show message
	if (!isBluetoothAvailable) {
		return (
			<SafeAreaView style={styles.container}>
				<Text style={styles.title}>Bluetooth</Text>
				<View style={styles.centeredContent}>
					<Text style={styles.warningText}>
						Bluetooth functionality requires a development build.
					</Text>
					<Text style={styles.instructionText}>
						Please run with 'expo run:android' to use this feature.
					</Text>
				</View>
				<StatusBar style="auto" />
			</SafeAreaView>
		);
	}

	// Handle device connection
	const handleConnect = async (deviceId: string) => {
		const device = await connectDevice(deviceId);
		if (device) {
			console.log("Successfully connected to:", device.name || device.id);
		}
	};

	// Handle sending a command
	const handleSendCommand = async () => {
		if (!command.trim()) {
			Alert.alert("Error", "Please enter a command to send");
			return;
		}

		const success = await sendCommand(command);
		if (success) {
			setCommand(""); // Clear the input on success
		}
	};

	return (
		<SafeAreaView style={styles.container}>
			<Text style={styles.title}>Bluetooth Devices</Text>

			{/* Error display */}
			{error && <Text style={styles.errorText}>{error}</Text>}

			{/* Scan button */}
			<View style={styles.scanButtonContainer}>
				{isScanning ? (
					<TouchableOpacity
						style={styles.scanButton}
						onPress={stopScan}
					>
						<Text style={styles.scanButtonText}>Stop Scanning</Text>
					</TouchableOpacity>
				) : (
					<TouchableOpacity
						style={styles.scanButton}
						onPress={scanForDevices}
					>
						<Text style={styles.scanButtonText}>
							Scan for Devices
						</Text>
					</TouchableOpacity>
				)}
			</View>

			{/* Scanning indicator */}
			{isScanning && (
				<View style={styles.scanningContainer}>
					<ActivityIndicator size="small" color="#0000ff" />
					<Text style={styles.scanningText}>Scanning...</Text>
				</View>
			)}

			{/* Connected device info */}
			{isConnected && connectedDevice && (
				<View style={styles.connectedDeviceContainer}>
					<Text style={styles.connectedDeviceTitle}>
						Connected to:
					</Text>
					<Text style={styles.connectedDeviceText}>
						{connectedDevice.name || connectedDevice.id}
					</Text>
					<TouchableOpacity
						style={styles.disconnectButton}
						onPress={disconnect}
					>
						<Text style={styles.disconnectButtonText}>
							Disconnect
						</Text>
					</TouchableOpacity>
				</View>
			)}

			{/* Device list */}
			<FlatList
				data={devices}
				keyExtractor={(item) => item.id}
				renderItem={({ item }) => (
					<TouchableOpacity
						style={styles.deviceItem}
						onPress={() => handleConnect(item.id)}
						disabled={isConnecting || isConnected}
					>
						<View>
							<Text style={styles.deviceName}>
								{item.name || "Unknown Device"}
							</Text>
							<Text style={styles.deviceId}>ID: {item.id}</Text>
							{item.rssi && (
								<Text style={styles.deviceRssi}>
									Signal: {item.rssi} dBm
								</Text>
							)}
						</View>
						{!isConnected && (
							<TouchableOpacity
								style={styles.connectButton}
								onPress={() => handleConnect(item.id)}
								disabled={isConnecting}
							>
								<Text style={styles.connectButtonText}>
									Connect
								</Text>
							</TouchableOpacity>
						)}
					</TouchableOpacity>
				)}
				ListEmptyComponent={
					!isScanning ? (
						<Text style={styles.emptyListText}>
							No devices found. Please scan for devices.
						</Text>
					) : null
				}
			/>

			{/* Command input area - only shown when connected */}
			{isConnected && (
				<View style={styles.commandContainer}>
					<Text style={styles.sectionTitle}>Send Command</Text>
					<TextInput
						style={styles.commandInput}
						value={command}
						onChangeText={setCommand}
						placeholder="Enter command"
					/>
					<Button title="Send" onPress={handleSendCommand} />
				</View>
			)}

			{/* Received data display */}
			{receivedData && (
				<View style={styles.dataContainer}>
					<Text style={styles.sectionTitle}>Received Data:</Text>
					<Text style={styles.dataText}>{receivedData}</Text>
				</View>
			)}

			<StatusBar style="auto" />
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "#f5f5f5",
		padding: 16,
	},
	title: {
		fontSize: 24,
		fontWeight: "bold",
		marginBottom: 16,
		textAlign: "center",
	},
	scanButtonContainer: {
		marginBottom: 16,
	},
	scanButton: {
		backgroundColor: "#2196F3",
		padding: 12,
		borderRadius: 8,
		alignItems: "center",
	},
	scanButtonText: {
		color: "white",
		fontWeight: "bold",
		fontSize: 16,
	},
	scanningContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		marginBottom: 16,
	},
	scanningText: {
		marginLeft: 8,
		fontSize: 16,
	},
	deviceItem: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "white",
		padding: 16,
		marginBottom: 8,
		borderRadius: 8,
		shadowColor: "#000",
		shadowOffset: { width: 0, height: 1 },
		shadowOpacity: 0.2,
		shadowRadius: 1,
		elevation: 2,
	},
	deviceName: {
		fontSize: 16,
		fontWeight: "bold",
	},
	deviceId: {
		fontSize: 12,
		color: "#666",
		marginTop: 4,
	},
	deviceRssi: {
		fontSize: 12,
		color: "#666",
		marginTop: 2,
	},
	connectButton: {
		backgroundColor: "#4CAF50",
		paddingVertical: 6,
		paddingHorizontal: 12,
		borderRadius: 4,
	},
	connectButtonText: {
		color: "white",
		fontWeight: "bold",
	},
	connectedDeviceContainer: {
		backgroundColor: "#e6f7ff",
		padding: 16,
		borderRadius: 8,
		marginBottom: 16,
	},
	connectedDeviceTitle: {
		fontSize: 16,
		fontWeight: "bold",
	},
	connectedDeviceText: {
		fontSize: 16,
		marginTop: 4,
	},
	disconnectButton: {
		backgroundColor: "#f44336",
		padding: 8,
		borderRadius: 4,
		marginTop: 8,
		alignSelf: "flex-start",
	},
	disconnectButtonText: {
		color: "white",
		fontWeight: "bold",
	},
	errorText: {
		color: "#f44336",
		marginBottom: 16,
		padding: 8,
		backgroundColor: "#ffebee",
		borderRadius: 4,
	},
	commandContainer: {
		backgroundColor: "white",
		padding: 16,
		borderRadius: 8,
		marginTop: 16,
	},
	sectionTitle: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 8,
	},
	commandInput: {
		borderWidth: 1,
		borderColor: "#ddd",
		borderRadius: 4,
		padding: 8,
		marginBottom: 8,
	},
	dataContainer: {
		backgroundColor: "white",
		padding: 16,
		borderRadius: 8,
		marginTop: 16,
	},
	dataText: {
		fontFamily: "monospace",
		fontSize: 14,
	},
	emptyListText: {
		textAlign: "center",
		marginTop: 20,
		color: "#666",
	},
	centeredContent: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		paddingHorizontal: 20,
	},
	warningText: {
		fontSize: 18,
		fontWeight: "bold",
		marginBottom: 12,
		textAlign: "center",
		color: "#f44336",
	},
	instructionText: {
		fontSize: 16,
		textAlign: "center",
		color: "#666",
	},
});
