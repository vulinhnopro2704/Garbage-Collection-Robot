import { useState, useCallback, useEffect } from "react";
import { Platform } from "react-native";

// Sử dụng IP mặc định cho môi trường khác nhau
const getDefaultWsUrl = () => {
	if (Platform.OS === "web") {
		// Trên web, cần phải sử dụng URL rõ ràng thay vì hostname
		return "ws://localhost:8765";
	}
	return "ws://raspberrypi.local:8765";
};

// Cho phép override URL thông qua tham số
export const useSocket = (wsUrl = getDefaultWsUrl()) => {
	const [isConnected, setIsConnected] = useState(false);
	const [socket, setSocket] = useState<WebSocket | null>(null);
	const [error, setError] = useState<string | null>(null);

	// Hàm kết nối WebSocket
	const connect = useCallback(() => {
		if (socket) return; // Nếu đã có socket, không tạo lại

		try {
			setError(null);
			const ws = new WebSocket(wsUrl);

			ws.onopen = () => {
				setIsConnected(true);
				console.log("Connected to WebSocket server");
			};

			ws.onclose = () => {
				setIsConnected(false);
				setSocket(null); // Clear socket khi ngắt kết nối
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
	}, [socket, wsUrl]);

	// Tự động kết nối lại khi mất kết nối
	useEffect(() => {
		return () => {
			// Cleanup khi unmount
			if (socket) {
				socket.close();
			}
		};
	}, [socket]);

	// Hàm ngắt kết nối WebSocket
	const disconnect = useCallback(() => {
		if (socket) {
			socket.close();
			setSocket(null);
			setIsConnected(false);
		}
	}, [socket]);

	// Hàm gửi lệnh qua WebSocket
	const sendCommand = useCallback(
		(command: string, speed: number) => {
			if (socket && isConnected) {
				socket.send(
					JSON.stringify({ direction: command, speed: speed })
				);
				console.log(`Sent: ${command}`);
			} else {
				console.error("WebSocket is not connected!");
			}
		},
		[socket, isConnected]
	);

	return { isConnected, connect, disconnect, sendCommand, error };
};
