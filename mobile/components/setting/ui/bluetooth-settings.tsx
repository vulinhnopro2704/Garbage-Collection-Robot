import React, { useState, useEffect } from "react";
import { Text, StyleSheet, Switch, ActivityIndicator } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useBluetoothConnection } from "@/hooks/use-bluetooth-connection";
import { Colors } from "@/constants/Colors";
import SettingItem from "./setting-item";
import DeviceList from "./device-list";
const BluetoothSettings = () => {
	const [showDeviceList, setShowDeviceList] = useState(false);
	const [selectedDevice, setSelectedDevice] = useState<string | null>(null);

	const {
		devices,
		isConnected,
		isScanning,
		scanForDevices,
		connectDevice,
		disconnect,
		connectedDevice,
		isBluetoothAvailable,
	} = useBluetoothConnection();

	// Handle bluetooth connection/disconnection
	const handleBluetoothToggle = async () => {
		if (isConnected) {
			await disconnect();
		} else {
			// If no device is connected, show device list or scan
			if (devices.length === 0) {
				scanForDevices();
			}
			setShowDeviceList(true);
		}
	};

	// Handle connecting to a selected device
	const handleConnectToDevice = async (deviceId: string) => {
		setSelectedDevice(deviceId);
		const result = await connectDevice(deviceId);
		if (result) {
			setShowDeviceList(false);
		}
	};

	// Start scanning for devices when the device list is shown
	useEffect(() => {
		if (
			showDeviceList &&
			!isScanning &&
			devices.length === 0 &&
			isBluetoothAvailable
		) {
			scanForDevices();
		}
	}, [
		showDeviceList,
		isScanning,
		devices.length,
		isBluetoothAvailable,
		scanForDevices,
	]);

	return (
		<>
			<SettingItem
				icon={
					<FontAwesome5
						name="bluetooth-b"
						size={20}
						color={
							isBluetoothAvailable
								? isConnected
									? Colors.primary
									: Colors.textSecondary
								: "#ccc" // Grayed out when not available
						}
					/>
				}
				title="Bluetooth Connection"
				description={
					!isBluetoothAvailable
						? "Requires development build"
						: isConnected
						? `Connected to ${connectedDevice?.name || "Device"}`
						: "Tap to connect to your device"
				}
				rightElement={
					!isBluetoothAvailable ? (
						<Text style={styles.unavailableText}>Unavailable</Text>
					) : isScanning ? (
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
							disabled={!isBluetoothAvailable}
						/>
					)
				}
				onPress={
					isBluetoothAvailable ? handleBluetoothToggle : undefined
				}
			/>

			{isBluetoothAvailable && showDeviceList && (
				<DeviceList
					devices={devices}
					isScanning={isScanning}
					selectedDevice={selectedDevice}
					onConnectDevice={handleConnectToDevice}
					onScan={scanForDevices}
					onCancel={() => setShowDeviceList(false)}
				/>
			)}
		</>
	);
};

const styles = StyleSheet.create({
	unavailableText: {
		fontSize: 12,
		color: "#999",
	},
});

export default BluetoothSettings;
