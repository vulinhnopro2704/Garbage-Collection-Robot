// import { useState, useEffect } from "react";
// import { BleManager } from "react-native-ble-plx";

// const manager = new BleManager();

// export const useBluetooth = () => {
// 	const [isConnected, setIsConnected] = useState(false);
// 	const [device, setDevice] = useState(null);

// 	useEffect(() => {
// 		const scanDevices = async () => {
// 			manager.startDeviceScan(null, null, (error, device) => {
// 				if (error) {
// 					console.error("Scan error:", error);
// 					return;
// 				}

// 				// Nếu phát hiện Raspberry Pi
// 				if (device.name === "RobotControl") {
// 					manager.stopDeviceScan();
// 					connectToDevice(device);
// 				}
// 			});
// 		};

// 		const connectToDevice = async (device) => {
// 			try {
// 				await device.connect();
// 				setIsConnected(true);
// 				setDevice(device);
// 				console.log("Connected to", device.name);
// 			} catch (err) {
// 				console.error("Connection error:", err);
// 			}
// 		};

// 		scanDevices();
// 	}, []);

// 	const sendCommand = async (command) => {
// 		if (!device) return;

// 		try {
// 			await device.writeCharacteristicWithoutResponse("UUID", command);
// 			console.log(`Sent: ${command}`);
// 		} catch (err) {
// 			console.error("Send command error:", err);
// 		}
// 	};

// 	return { isConnected, sendCommand };
// };
