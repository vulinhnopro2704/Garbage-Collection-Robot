import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "@/constants/Colors";
import SectionContainer from "./section-container";
import SettingItem from "../ui/setting-item";

const AboutSection = () => {
	return (
		<SectionContainer title="About">
			<SettingItem
				icon={
					<MaterialIcons
						name="info"
						size={22}
						color={Colors.textSecondary}
					/>
				}
				title="App Information"
				description="Version 1.0.0"
			/>

			<SettingItem
				icon={
					<MaterialIcons
						name="help"
						size={22}
						color={Colors.textSecondary}
					/>
				}
				title="Help & Support"
			/>
		</SectionContainer>
	);
};

export default AboutSection;
