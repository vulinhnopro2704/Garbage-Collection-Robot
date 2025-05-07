import { useState, useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { useRobotStore } from "@/store/robotStore";
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
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Get state and methods from Zustand store
	const { isConnected, setIsConnected, setLastCommand, setBinStatus } =
		useRobotStore();

	// Connect to WebSocket
	const connect = useCallback(() => {
		if (socket) return; // If socket exists, don't create a new one

		try {
			setError(null);
			const ws = new WebSocket(wsUrl);

			ws.onopen = () => {
				setIsConnected(true);
				console.log("Connected to WebSocket server");
			};

			ws.onmessage = (event) => {
				// Use the WebSocketService to handle incoming
				console.log("Received message:", event.data);
			};

			ws.onclose = () => {
				setIsConnected(false);
				setSocket(null); // Clear socket when disconnected
				console.log("Disconnected from WebSocket server");
			};

			ws.onerror = (error) => {
				console.error("WebSocket error:", error);
				setError("Failed to connect to WebSocket server");
			};

			setSocket(ws);
		} catch (err) {
			console.error("WebSocket connection error:", err);
			setError(
				`WebSocket connection failed: ${
					err instanceof Error ? err.message : String(err)
				}`
			);
		}
	}, [socket, wsUrl, setIsConnected]);

	// Auto-reconnect when connection is lost
	useEffect(() => {
		if (!socket) {
			// If socket is null, try to connect
			connect();
		}
		return () => {
			// Cleanup when unmounted
			if (socket) {
				socket.close();
			}
		};
	}, [socket]);

	// Disconnect WebSocket
	const disconnect = useCallback(() => {
		if (socket) {
			socket.close();
			setSocket(null);
			setIsConnected(false);
		}
	}, [socket, setIsConnected]);

	// Send command through WebSocket
	const sendCommand = useCallback(
		(command: RobotCommand, speed: number) => {
			console.log("Sending command:", command, speed);
			console.log("isConnected:", isConnected);
			console.log("socket:", socket);
			if (!socket) {
				connect();
				console.log("Socket was null, trying to connect...");
			}
			if (socket && isConnected) {
				socket.send(
					JSON.stringify({ direction: command, speed: speed })
				);
				setLastCommand(command);
				console.log(`Sent: ${command}`);
			} else {
				console.error("WebSocket is not connected!");
			}
		},
		[socket, isConnected, setLastCommand]
	);

	return { isConnected, connect, disconnect, sendCommand, error, socket };
};
