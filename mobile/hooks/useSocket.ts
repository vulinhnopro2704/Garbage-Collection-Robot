import { useState, useCallback } from "react";

const WS_URL = "ws://raspberrypi.local:8765"; // Thay <RASP_IP> bằng địa chỉ IP của Raspberry Pi

export const useSocket = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [socket, setSocket] = useState<WebSocket | null>(null);

	// Hàm kết nối WebSocket
	const connect = useCallback(() => {
		if (socket) return; // Nếu đã có socket, không tạo lại

		const ws = new WebSocket(WS_URL);

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
		};

		setSocket(ws);
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
				socket.send(JSON.stringify({ direction: command, speed: speed }));
				console.log(`Sent: ${command}`);
			} else {
				console.error("WebSocket is not connected!");
			}
		},
		[socket, isConnected]
	);

	return { isConnected, connect, disconnect, sendCommand };
};
