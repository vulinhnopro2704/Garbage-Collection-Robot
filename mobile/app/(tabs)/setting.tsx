import React from "react";
import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import { StatusBar } from "expo-status-bar";

import { Colors } from "@/constants/Colors";
import Header from "@/components/setting/header";
import ConnectionSettings from "@/components/setting/section/connection-setting";
import NotificationSettings from "@/components/setting/section/notification-setting";
import RecentDetections from "@/components/setting/section/recent-detection";
import AboutSection from "@/components/setting/section/about-section";
import { useRobotStore } from "@/store/robotStore";
import SectionContainer from "@/components/setting/section/section-container";
import RobotConfigSection from "@/components/setting/section/robot-config-section";

export default function Setting() {
	const {
		isPoweredOn,
		setIsPoweredOn,
		isAutoMode,
		setIsAutoMode,
		speed,
		setSpeed,
	} = useRobotStore();

	return (
		<SafeAreaView style={styles.container}>
			<StatusBar style="dark" />
			<Header title="Settings" />

			<ScrollView
				style={styles.scrollView}
				showsVerticalScrollIndicator={false}
			>
				{/* Robot Configuration Section */}
				<RobotConfigSection
					isPoweredOn={isPoweredOn}
					setIsPoweredOn={setIsPoweredOn}
					isAutoMode={isAutoMode}
					setIsAutoMode={setIsAutoMode}
					speed={speed}
					setSpeed={setSpeed}
				/>

				{/* Connection Settings */}
				<ConnectionSettings />

				{/* Notification Settings */}
				<NotificationSettings />

				{/* Recent Detections */}
				<RecentDetections />

				{/* About Section */}
				<AboutSection />

				{/* Add extra space at bottom for scrolling comfort */}
				<View style={styles.bottomPadding} />
			</ScrollView>
		</SafeAreaView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.background,
	},
	scrollView: {
		flex: 1,
	},
	bottomPadding: {
		height: 40,
	},
});
