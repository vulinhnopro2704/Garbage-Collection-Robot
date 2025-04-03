import React from "react";
import SectionContainer from "./section-container";
import BluetoothSettings from "../ui/bluetooth-settings";
import WifiSettings from "../ui/wifi-setting";

const ConnectionSettings = () => {
	return (
		<SectionContainer title="Connection Settings">
			<BluetoothSettings />
			<WifiSettings />
		</SectionContainer>
	);
};

export default ConnectionSettings;
