import React from "react";
import SectionContainer from "./section-container";
import WifiSettings from "../ui/wifi-setting";

const ConnectionSettings = () => {
	return (
		<SectionContainer title="Connection Settings">
			<WifiSettings />
		</SectionContainer>
	);
};

export default ConnectionSettings;
