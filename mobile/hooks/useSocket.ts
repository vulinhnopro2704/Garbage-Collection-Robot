import { useState, useCallback, useEffect, useRef } from "react";
import { Platform } from "react-native";
import Toast from "react-native-toast-message";
import { RobotCommand } from "@/constants/command";

// Default WS URL for different environments
const getDefaultWsUrl = () => {
	if (Platform.OS === "web") {
		// On web, we need to use a clear URL instead of hostname
		return "ws://localhost:8765";
	}
	return "ws://raspberrypi.local:8765";
};

// Allow URL override through parameter
export const useSocket = (wsUrl = getDefaultWsUrl()) => {
	// Socket connection states
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [isConnected, setIsConnected] = useState(false);
	const [isConnecting, setIsConnecting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [reconnectAttempt, setReconnectAttempt] = useState(0);

	// Robot states (previously in robotStore)
	const [isPoweredOn, setIsPoweredOn] = useState(true);
	const [isAutoMode, setIsAutoMode] = useState(false);
	const [speed, setSpeed] = useState(50);
	const [lastCommand, setLastCommand] = useState<RobotCommand | null>(null);
	const [binStatus, setBinStatus] = useState<number>(0);

	const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
		null
	);
	const maxReconnectDelay = 30000; // Maximum reconnect delay: 30 seconds

	// Clear any existing reconnect timer
	const clearReconnectTimer = () => {
		if (reconnectTimerRef.current) {
			clearTimeout(reconnectTimerRef.current);
			reconnectTimerRef.current = null;
		}
	};

	// Connect to WebSocket with reconnect logic
	const connect = useCallback(() => {
		if (socket || isConnecting) return; // Don't connect if already connected or connecting

		clearReconnectTimer(); // Clear any existing reconnect timer
		setIsConnecting(true);

		try {
			setError(null);
			const ws = new WebSocket(wsUrl);

			ws.onopen = () => {
				setIsConnected(true);
				setIsConnecting(false);
				setReconnectAttempt(0); // Reset reconnect attempts on successful connection
				console.log("Connected to WebSocket server");
				Toast.show({
					type: "success",
					text1: "Connected",
					text2: "Successfully connected to the robot",
					position: "bottom",
					visibilityTime: 2000,
				});
			};

			ws.onmessage = (event) => {
				console.log("Received message:", event.data);
				try {
					const data = JSON.parse(event.data);

					// Handle incoming messages with robot state updates
					if (data.binStatus !== undefined) {
						setBinStatus(data.binStatus);
					}

					if (data.isAutoMode !== undefined) {
						setIsAutoMode(data.isAutoMode);
					}

					if (data.speed !== undefined) {
						setSpeed(data.speed);
					}

					if (data.isPoweredOn !== undefined) {
						setIsPoweredOn(data.isPoweredOn);
					}
				} catch (err) {
					console.error("Error parsing WebSocket message:", err);
				}
			};

			ws.onclose = () => {
				setIsConnected(false);
				setSocket(null);
				setIsConnecting(false);
				console.log("Disconnected from WebSocket server");

				// Schedule reconnect with exponential backoff
				const nextReconnectAttempt = reconnectAttempt + 1;
				setReconnectAttempt(nextReconnectAttempt);

				// Calculate backoff delay with jitter: base * (1.5 ^ attempt) + random jitter
				const baseDelay = 1000; // Start with 1 second
				const backoffFactor = Math.pow(1.5, nextReconnectAttempt);
				const jitter = Math.random() * 1000; // Random jitter between 0-1000ms
				const delay = Math.min(
					baseDelay * backoffFactor + jitter,
					maxReconnectDelay
				);

				console.log(
					`Scheduling reconnect in ${Math.round(
						delay / 1000
					)}s (attempt ${nextReconnectAttempt})`
				);

				Toast.show({
					type: "error",
					text1: "Disconnected",
					text2: `Reconnecting in ${Math.round(delay / 1000)}s...`,
					position: "bottom",
					visibilityTime: 3000,
				});

				reconnectTimerRef.current = setTimeout(() => {
					connect();
				}, delay);
			};

			ws.onerror = (error) => {
				console.error("WebSocket error:", error);
				setError("Failed to connect to WebSocket server");
				setIsConnecting(false);

				Toast.show({
					type: "error",
					text1: "Connection Error",
					text2: "Failed to connect to the robot",
					position: "bottom",
					visibilityTime: 3000,
				});
			};

			setSocket(ws);
		} catch (err) {
			console.error("WebSocket connection error:", err);
			setError(
				`WebSocket connection failed: ${
					err instanceof Error ? err.message : String(err)
				}`
			);
			setIsConnecting(false);

			// Schedule immediate reconnect on error
			reconnectTimerRef.current = setTimeout(() => {
				connect();
			}, 2000);
		}
	}, [socket, wsUrl, reconnectAttempt, isConnecting]);

	// Auto-reconnect when connection is lost
	useEffect(() => {
		if (!socket && !isConnecting) {
			// If socket is null and not already trying to connect, initiate connection
			connect();
		}
		return () => {
			// Cleanup when unmounted
			if (socket) {
				socket.close();
			}
			clearReconnectTimer();
		};
	}, [socket, connect, isConnecting]);

	// Disconnect WebSocket
	const disconnect = useCallback(() => {
		clearReconnectTimer(); // Stop any pending reconnection attempts
		if (socket) {
			socket.close();
			setSocket(null);
			setIsConnected(false);
			setReconnectAttempt(0); // Reset reconnect counter

			Toast.show({
				type: "info",
				text1: "Disconnected",
				text2: "Manually disconnected from the robot",
				position: "bottom",
				visibilityTime: 2000,
			});
		}
	}, [socket]);

	// Send command through WebSocket
	const sendCommand = useCallback(
		(command: RobotCommand, speed: number) => {
			console.log("Sending command:", command, speed);

			if (!socket) {
				connect();
				Toast.show({
					type: "info",
					text1: "Connecting...",
					text2: "Trying to connect before sending command",
					position: "bottom",
					visibilityTime: 2000,
				});
				return; // Don't try to send if we're just now connecting
			}

			if (socket && isConnected) {
				try {
					socket.send(
						JSON.stringify({ direction: command, speed: speed })
					);
					setLastCommand(command);
					console.log(`Sent: ${command}`);
				} catch (err) {
					console.error("Error sending command:", err);
					Toast.show({
						type: "error",
						text1: "Command Failed",
						text2: "Could not send command to the robot",
						position: "bottom",
						visibilityTime: 2000,
					});
				}
			} else {
				console.error("WebSocket is not connected!");
				Toast.show({
					type: "error",
					text1: "Not Connected",
					text2: "Cannot send command while disconnected",
					position: "bottom",
					visibilityTime: 2000,
				});
			}
		},
		[socket, isConnected, connect]
	);

	// Toggle power state
	const togglePower = useCallback(() => {
		const newPowerState = !isPoweredOn;
		setIsPoweredOn(newPowerState);

		// Send power state to robot if connected
		if (socket && isConnected) {
			socket.send(JSON.stringify({ isPoweredOn: newPowerState }));
		}

		Toast.show({
			type: "info",
			text1: newPowerState ? "Robot Powered On" : "Robot Powered Off",
			position: "bottom",
			visibilityTime: 2000,
		});
	}, [isPoweredOn, socket, isConnected]);

	// Toggle auto mode
	const toggleAutoMode = useCallback(() => {
		const newAutoMode = !isAutoMode;
		setIsAutoMode(newAutoMode);

		// Send auto mode state to robot if connected
		if (socket && isConnected) {
			socket.send(JSON.stringify({ isAutoMode: newAutoMode }));
		}

		Toast.show({
			type: "info",
			text1: newAutoMode ? "Auto Mode Enabled" : "Auto Mode Disabled",
			position: "bottom",
			visibilityTime: 2000,
		});
	}, [isAutoMode, socket, isConnected]);

	// Update speed
	const updateSpeed = useCallback(
		(newSpeed: number) => {
			setSpeed(newSpeed);

			// Send speed to robot if connected
			if (socket && isConnected) {
				socket.send(JSON.stringify({ speed: newSpeed }));
			}
		},
		[socket, isConnected]
	);

	return {
		// Connection states
		isConnected,
		isConnecting,
		connect,
		disconnect,
		sendCommand,
		error,
		socket,
		reconnectAttempt,

		// Robot states
		isPoweredOn,
		setIsPoweredOn,
		isAutoMode,
		setIsAutoMode,
		speed,
		setSpeed,
		lastCommand,
		binStatus,

		// Robot state actions
		togglePower,
		toggleAutoMode,
		updateSpeed,
		setBinStatus,
	};
};
