import { useState, useCallback, useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";

// Service and characteristic UUIDs for Raspberry Pi communication
const SERVICE_UUID = "YOUR_SERVICE_UUID";
const WRITE_CHARACTERISTIC_UUID = "YOUR_WRITE_CHARACTERISTIC_UUID";
const READ_CHARACTERISTIC_UUID = "YOUR_READ_CHARACTERISTIC_UUID";

export interface BluetoothDevice {
	id: string;
	name: string | null;
	rssi: number | null;
	isConnectable?: boolean | null;
}

// Determine if we're in a development build with native modules
const isDevBuild = () => {
	try {
		// This will throw an error in Expo Go if the native module isn't available
		require("react-native-ble-plx");
		return true;
	} catch (e) {
		return false;
	}
};

export const useBluetoothConnection = () => {
	const [devices, setDevices] = useState<BluetoothDevice[]>([]);
	const [connectedDevice, setConnectedDevice] = useState<any | null>(null);
	const [isScanning, setIsScanning] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [receivedData, setReceivedData] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [bleManager, setBleManager] = useState<any | null>(null);
	const [isAvailable, setIsAvailable] = useState(false);

	// Initialize BLE manager if in development build
	useEffect(() => {
		const initBleManager = async () => {
			if (isDevBuild()) {
				try {
					const { BleManager } = require("react-native-ble-plx");
					const manager = new BleManager();
					setBleManager(manager);
					setIsAvailable(true);
				} catch (err) {
					console.error("Failed to initialize BLE manager:", err);
					setError("Bluetooth module not available");
				}
			} else {
				setError(
					"Bluetooth functionality requires a development build"
				);
			}
		};

		initBleManager();

		// Cleanup on unmount
		return () => {
			if (bleManager) {
				bleManager.destroy();
			}
		};
	}, []);

	// Request permissions (Android only)
	const requestPermissions = useCallback(async () => {
		if (!isAvailable) return false;

		if (Platform.OS === "android") {
			try {
				const granted = await PermissionsAndroid.requestMultiple([
					PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
					PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
				]);

				return Object.values(granted).every(
					(result) => result === PermissionsAndroid.RESULTS.GRANTED
				);
			} catch (err) {
				console.error("Permission request error:", err);
				return false;
			}
		}
		return true;
	}, [isAvailable]);

	// Scan for devices
	const scanForDevices = useCallback(async () => {
		if (!isAvailable || !bleManager) {
			setError("Bluetooth functionality requires a development build");
			return;
		}

		try {
			const hasPermissions = await requestPermissions();
			if (!hasPermissions) {
				setError("Bluetooth permissions not granted");
				return;
			}

			setIsScanning(true);
			setError(null);
			setDevices([]);

			// Check if Bluetooth is powered on
			const { State } = require("react-native-ble-plx");
			const state = await bleManager.state();
			if (state !== State.PoweredOn) {
				setError("Bluetooth is not enabled");
				setIsScanning(false);
				return;
			}

			// Start scanning
			bleManager.startDeviceScan(
				null,
				null,
				(error: any, device: any) => {
					if (error) {
						console.error("Scan error:", error);
						setError(`Scanning failed: ${error.message}`);
						setIsScanning(false);
						return;
					}

					if (device) {
						// Add device to list if not already present
						setDevices((prevDevices) => {
							const existingDevice = prevDevices.find(
								(d) => d.id === device.id
							);
							if (existingDevice) return prevDevices;

							const newDevice: BluetoothDevice = {
								id: device.id,
								name: device.name,
								rssi: device.rssi,
								isConnectable: device.isConnectable,
							};
							return [...prevDevices, newDevice];
						});
					}
				}
			);

			// Stop scanning after 10 seconds
			setTimeout(() => {
				if (bleManager && isScanning) {
					bleManager.stopDeviceScan();
					setIsScanning(false);
				}
			}, 10000);
		} catch (err) {
			setError(
				`Scanning error: ${
					err instanceof Error ? err.message : String(err)
				}`
			);
			setIsScanning(false);
		}
	}, [bleManager, isAvailable, requestPermissions, isScanning]);

	// Stop scanning
	const stopScan = useCallback(() => {
		if (bleManager && isScanning) {
			bleManager.stopDeviceScan();
			setIsScanning(false);
		}
	}, [bleManager, isScanning]);

	// Connect to a device
	const connectDevice = useCallback(
		async (deviceId: string) => {
			if (!isAvailable || !bleManager) {
				setError(
					"Bluetooth functionality requires a development build"
				);
				return null;
			}

			try {
				setIsConnecting(true);
				setError(null);

				// Connect to device
				const device = await bleManager.connectToDevice(deviceId);
				console.log("Connected to device:", device.name || device.id);

				// Discover services and characteristics
				await device.discoverAllServicesAndCharacteristics();
				console.log("Discovered services and characteristics");

				// Set up notification listener for incoming data
				const base64 = require("base64-js");
				device.monitorCharacteristicForService(
					SERVICE_UUID,
					READ_CHARACTERISTIC_UUID,
					(error: any, characteristic: any) => {
						if (error) {
							console.error("Notification error:", error);
							return;
						}

						if (characteristic?.value) {
							const valueBytes = base64.toByteArray(
								characteristic.value
							);
							const value = new TextDecoder().decode(valueBytes);
							console.log("Received data:", value);
							setReceivedData(value);
						}
					}
				);

				// Set up disconnect listener
				device.onDisconnected((error: any, disconnectedDevice: any) => {
					console.log(
						"Device disconnected:",
						disconnectedDevice?.name || disconnectedDevice?.id
					);
					setIsConnected(false);
					setConnectedDevice(null);
					if (error) {
						setError(`Device disconnected: ${error.message}`);
					}
				});

				setConnectedDevice(device);
				setIsConnected(true);
				setIsConnecting(false);
				return device;
			} catch (err) {
				setError(
					`Connection error: ${
						err instanceof Error ? err.message : String(err)
					}`
				);
				setIsConnecting(false);
				setIsConnected(false);
				return null;
			}
		},
		[bleManager, isAvailable]
	);

	// Disconnect from device
	const disconnect = useCallback(async () => {
		if (connectedDevice) {
			try {
				await connectedDevice.cancelConnection();
				setConnectedDevice(null);
				setIsConnected(false);
				console.log("Disconnected successfully");
			} catch (err) {
				setError(
					`Disconnect error: ${
						err instanceof Error ? err.message : String(err)
					}`
				);
			}
		}
	}, [connectedDevice]);

	// Send command to device
	const sendCommand = useCallback(
		async (command: string) => {
			if (!connectedDevice || !isConnected) {
				setError("Cannot send command: not connected to device");
				return false;
			}

			try {
				const base64 = require("base64-js");
				const data = base64.fromByteArray(
					new TextEncoder().encode(command)
				);
				await connectedDevice.writeCharacteristicWithResponseForService(
					SERVICE_UUID,
					WRITE_CHARACTERISTIC_UUID,
					data
				);
				console.log(`Command sent: ${command}`);
				return true;
			} catch (err) {
				setError(
					`Send error: ${
						err instanceof Error ? err.message : String(err)
					}`
				);
				return false;
			}
		},
		[connectedDevice, isConnected]
	);

	// Clean up on unmount
	useEffect(() => {
		return () => {
			if (bleManager && isScanning) {
				bleManager.stopDeviceScan();
			}
			if (connectedDevice) {
				connectedDevice.cancelConnection();
			}
		};
	}, [bleManager, isScanning, connectedDevice]);

	return {
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
		isBluetoothAvailable: isAvailable,
	};
};
