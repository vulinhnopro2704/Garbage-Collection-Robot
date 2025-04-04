// Command types to ensure type safety when sending commands
export type DirectionCommand =
	| "FORWARD"
	| "BACKWARD"
	| "LEFT"
	| "RIGHT"
	| "STOP";
export type ActionCommand = "GRAB_TRASH" | "ROTATE_BIN";
export type ModeCommand = "AUTO_MODE" | "MANUAL_MODE";
export type PowerCommand = "POWER_ON" | "POWER_OFF";
export type SpeedCommand = `SPEED_${number}`;
export type RobotCommand =
	| DirectionCommand
	| ActionCommand
	| ModeCommand
	| PowerCommand
	| SpeedCommand;
