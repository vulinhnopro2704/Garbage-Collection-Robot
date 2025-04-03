import React, { useState } from "react";
import { Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import SectionContainer from "./section-container";
import SettingItem from "../ui/setting-item";

const NotificationSettings = () => {
	const [notificationsEnabled, setNotificationsEnabled] = useState(true);
	const [soundEnabled, setSoundEnabled] = useState(true);
	const [vibrationEnabled, setVibrationEnabled] = useState(true);

	return (
		<SectionContainer title="Notifications">
			<SettingItem
				icon={
					<Ionicons
						name="notifications"
						size={22}
						color={
							notificationsEnabled
								? Colors.primary
								: Colors.textSecondary
						}
					/>
				}
				title="Push Notifications"
				description="Receive alerts about trash detections"
				rightElement={
					<Switch
						value={notificationsEnabled}
						onValueChange={setNotificationsEnabled}
						trackColor={{
							false: "#767577",
							true: Colors.primary,
						}}
						thumbColor="#f4f3f4"
					/>
				}
			/>

			<SettingItem
				icon={
					<Ionicons
						name="volume-medium"
						size={22}
						color={
							soundEnabled ? Colors.primary : Colors.textSecondary
						}
					/>
				}
				title="Sound Effects"
				description="Play sounds for button press and alerts"
				rightElement={
					<Switch
						value={soundEnabled}
						onValueChange={setSoundEnabled}
						trackColor={{
							false: "#767577",
							true: Colors.primary,
						}}
						thumbColor="#f4f3f4"
					/>
				}
			/>

			<SettingItem
				icon={
					<Ionicons
						name="accessibility"
						size={22}
						color={
							vibrationEnabled
								? Colors.primary
								: Colors.textSecondary
						}
					/>
				}
				title="Vibration"
				description="Vibrate on notifications and actions"
				rightElement={
					<Switch
						value={vibrationEnabled}
						onValueChange={setVibrationEnabled}
						trackColor={{
							false: "#767577",
							true: Colors.primary,
						}}
						thumbColor="#f4f3f4"
					/>
				}
			/>
		</SectionContainer>
	);
};

export default NotificationSettings;
