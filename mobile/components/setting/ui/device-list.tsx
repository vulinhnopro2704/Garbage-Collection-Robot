import React from "react";
import {
	View,
	Text,
	StyleSheet,
	ActivityIndicator,
	TouchableOpacity,
} from "react-native";
import { Colors } from "@/constants/Colors";
import { BluetoothDevice } from "@/hooks/use-bluetooth-connection";

interface DeviceListProps {
	devices: BluetoothDevice[];
	isScanning: boolean;
	selectedDevice: string | null;
	onConnectDevice: (deviceId: string) => void;
	onScan: () => void;
	onCancel: () => void;
}

const DeviceList: React.FC<DeviceListProps> = ({
	devices,
	isScanning,
	selectedDevice,
	onConnectDevice,
	onScan,
	onCancel,
}) => {
	return (
		<View style={styles.deviceList}>
			{isScanning && devices.length === 0 ? (
				<View style={styles.scanningIndicator}>
					<ActivityIndicator size="small" color={Colors.primary} />
					<Text style={styles.scanningText}>
						Scanning for devices...
					</Text>
				</View>
			) : devices.length === 0 ? (
				<Text style={styles.noDevicesText}>No devices found</Text>
			) : (
				<>
					<Text style={styles.deviceListTitle}>
						Available Devices
					</Text>
					{devices.map((device) => (
						<TouchableOpacity
							key={device.id}
							style={[
								styles.deviceItem,
								selectedDevice === device.id &&
									styles.selectedDevice,
							]}
							onPress={() => onConnectDevice(device.id)}
						>
							<Text style={styles.deviceName}>
								{device.name || "Unknown Device"}
							</Text>
							<Text style={styles.deviceId}>{device.id}</Text>
						</TouchableOpacity>
					))}
				</>
			)}

			<View style={styles.deviceListActions}>
				<TouchableOpacity
					style={styles.scanButton}
					onPress={onScan}
					disabled={isScanning}
				>
					<Text style={styles.scanButtonText}>
						{isScanning ? "Scanning..." : "Scan Again"}
					</Text>
				</TouchableOpacity>
				<TouchableOpacity
					style={styles.cancelButton}
					onPress={onCancel}
				>
					<Text style={styles.cancelButtonText}>Cancel</Text>
				</TouchableOpacity>
			</View>
		</View>
	);
};

const styles = StyleSheet.create({
	deviceList: {
		marginTop: 8,
		marginBottom: 16,
		backgroundColor: "rgba(0,0,0,0.03)",
		padding: 12,
		borderRadius: 8,
	},
	deviceListTitle: {
		fontSize: 16,
		fontWeight: "500",
		marginBottom: 8,
		color: Colors.text,
	},
	deviceItem: {
		padding: 12,
		backgroundColor: "white",
		borderRadius: 8,
		marginBottom: 8,
		borderWidth: 1,
		borderColor: "rgba(0,0,0,0.05)",
	},
	selectedDevice: {
		borderColor: Colors.primary,
		borderWidth: 2,
	},
	deviceName: {
		fontSize: 15,
		fontWeight: "500",
		marginBottom: 4,
	},
	deviceId: {
		fontSize: 12,
		color: Colors.textSecondary,
	},
	deviceListActions: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginTop: 8,
	},
	scanButton: {
		backgroundColor: Colors.primary,
		padding: 8,
		borderRadius: 6,
		flex: 1,
		marginRight: 8,
		alignItems: "center",
	},
	scanButtonText: {
		color: "white",
		fontWeight: "500",
	},
	cancelButton: {
		backgroundColor: "#f0f0f0",
		padding: 8,
		borderRadius: 6,
		flex: 1,
		alignItems: "center",
	},
	cancelButtonText: {
		color: "#666",
	},
	scanningIndicator: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		padding: 16,
	},
	scanningText: {
		marginLeft: 8,
		color: Colors.textSecondary,
	},
	noDevicesText: {
		textAlign: "center",
		padding: 16,
		color: Colors.textSecondary,
	},
});

export default DeviceList;
