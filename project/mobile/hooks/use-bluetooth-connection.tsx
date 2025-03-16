import { useState, useCallback, useEffect } from "react";

// Mock Bluetooth connection hook for development in Expo Go
export const useBluetoothConnection = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [isScanning, setIsScanning] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Mock connection checker that runs every 5 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			// Randomly disconnect sometimes to simulate real-world behavior
			if (isConnected && Math.random() > 0.9) {
				setIsConnected(false);
				setError("Connection lost. Please reconnect.");
			}
		}, 5000);

		return () => clearInterval(interval);
	}, [isConnected]);

	// Mock connect function
	const connectDevice = useCallback(async () => {
		if (isConnected) return;

		setIsScanning(true);
		setError(null);

		// Simulate connection delay
		await new Promise((resolve) => setTimeout(resolve, 2000));

		// 90% chance of successful connection
		if (Math.random() > 0.1) {
			setIsConnected(true);
			console.log("Mock Bluetooth: Connected successfully");
		} else {
			setError("Failed to connect. Device not found.");
		}

		setIsScanning(false);
	}, [isConnected]);

	// Mock disconnect function
	const disconnect = useCallback(() => {
		if (!isConnected) return;

		setIsConnected(false);
		console.log("Mock Bluetooth: Disconnected");
	}, [isConnected]);

	// Mock send command function
	const sendCommand = useCallback(
		(command: string) => {
			if (!isConnected) {
				console.warn(
					"Mock Bluetooth: Cannot send command, not connected"
				);
				return;
			}

			console.log(`Mock Bluetooth: Sending command: ${command}`);

			// In a real implementation, this would send the command to the device
			// For mock purposes, we just log it
		},
		[isConnected]
	);

	return {
		isConnected,
		isScanning,
		error,
		connectDevice,
		disconnect,
		sendCommand,
	};
};
