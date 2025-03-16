/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
	light: {
		text: "#11181C",
		background: "#fff",
		tint: tintColorLight,
		icon: "#687076",
		tabIconDefault: "#687076",
		tabIconSelected: tintColorLight,
	},
	dark: {
		text: "#ECEDEE",
		background: "#151718",
		tint: tintColorDark,
		icon: "#9BA1A6",
		tabIconDefault: "#9BA1A6",
		tabIconSelected: tintColorDark,
	},
	// Primary brand colors
	primary: "#007AFF", // Blue - main action color
	secondary: "#5856D6", // Purple - secondary actions

	// UI background colors
	background: "#F2F2F7", // Light gray - main app background
	cardBackground: "#FFFFFF", // White - for cards and content areas

	// Text colors
	text: "#1C1C1E", // Almost black - primary text
	textSecondary: "#8E8E93", // Gray - secondary text

	// Status colors
	success: "#4CD964", // Green - success states and "on" indicators
	warning: "#FF9500", // Orange - warning states
	error: "#FF3B30", // Red - error states
	info: "#5AC8FA", // Light blue - information

	// Control-specific colors
	sliderTrack: "#E5E5EA", // Light gray - slider background
	toggleBackground: "#E5E5EA", // Light gray - toggle background when off

	// Other UI elements
	border: "#C7C7CC", // Light gray - borders
	buttonDisabled: "#C7C7CC", // Light gray - disabled buttons
	overlay: "rgba(0,0,0,0.5)", // Semi-transparent black - overlays
};
