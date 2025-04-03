import { useState, useCallback, useEffect } from "react";
import { BleManager, Device, State } from "react-native-ble-plx";
import { PermissionsAndroid, Platform } from "react-native";
import base64 from "base64-js";

// Singleton BLE manager instance
const bleManager = new BleManager();

// Service and characteristic UUIDs for Raspberry Pi communication
// You'll need to replace these with your actual UUIDs from your Raspberry Pi service
const SERVICE_UUID = "YOUR_SERVICE_UUID";
const WRITE_CHARACTERISTIC_UUID = "YOUR_WRITE_CHARACTERISTIC_UUID";
const READ_CHARACTERISTIC_UUID = "YOUR_READ_CHARACTERISTIC_UUID";

export interface BluetoothDevice {
	id: string;
	name: string | null;
	rssi: number | null;
	isConnectable?: boolean | null;
}

export const useBluetoothConnection = () => {
	const [devices, setDevices] = useState<BluetoothDevice[]>([]);
	const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
	const [isScanning, setIsScanning] = useState(false);
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [receivedData, setReceivedData] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Request permissions (Android only)
	const requestPermissions = useCallback(async () => {
		if (Platform.OS === "android") {
			const granted = await PermissionsAndroid.requestMultiple([
				PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
				PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
			]);

			return Object.values(granted).every(
				(result) => result === PermissionsAndroid.RESULTS.GRANTED
			);
		}
		return true;
	}, []);

	// Scan for devices
	const scanForDevices = useCallback(async () => {
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
			const state = await bleManager.state();
			if (state !== State.PoweredOn) {
				setError("Bluetooth is not enabled");
				setIsScanning(false);
				return;
			}

			// Start scanning
			bleManager.startDeviceScan(null, null, (error, device) => {
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
			});

			// Stop scanning after 10 seconds
			setTimeout(() => {
				bleManager.stopDeviceScan();
				setIsScanning(false);
			}, 10000);
		} catch (err) {
			setError(
				`Scanning error: ${
					err instanceof Error ? err.message : String(err)
				}`
			);
			setIsScanning(false);
		}
	}, [requestPermissions]);

	// Stop scanning
	const stopScan = useCallback(() => {
		bleManager.stopDeviceScan();
		setIsScanning(false);
	}, []);

	// Connect to a device
	const connectDevice = useCallback(async (deviceId: string) => {
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
			device.monitorCharacteristicForService(
				SERVICE_UUID,
				READ_CHARACTERISTIC_UUID,
				(error, characteristic) => {
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
			device.onDisconnected((error, disconnectedDevice) => {
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
	}, []);

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
			if (isScanning) {
				bleManager.stopDeviceScan();
			}
			if (connectedDevice) {
				connectedDevice.cancelConnection();
			}
		};
	}, [isScanning, connectedDevice]);

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
	};
};
