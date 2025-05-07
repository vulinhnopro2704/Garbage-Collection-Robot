import { create } from "zustand";
import { RobotCommand, SpeedCommand } from "@/constants/command";

interface BinStatus {
	status: string;
	action: string;
	currentBin: number;
}

interface RobotState {
	// Power state
	isPoweredOn: boolean;
	setIsPoweredOn: (isOn: boolean) => void;

	// Mode state
	isAutoMode: boolean;
	setIsAutoMode: (isAuto: boolean) => void;

	// Speed state
	speed: number;
	setSpeed: (speed: number) => void;

	// Connection state
	isConnected: boolean;
	setIsConnected: (isConnected: boolean) => void;

	// Last command sent
	lastCommand: RobotCommand | null;
	setLastCommand: (command: RobotCommand) => void;

	// Bin rotation status
	binStatus: BinStatus | null;
	setBinStatus: (status: BinStatus) => void;
}

export const useRobotStore = create<RobotState>((set) => ({
	isPoweredOn: false,
	setIsPoweredOn: (isOn) => set({ isPoweredOn: isOn }),

	isAutoMode: false,
	setIsAutoMode: (isAuto) => set({ isAutoMode: isAuto }),

	speed: 50,
	setSpeed: (speed) => set({ speed }),

	isConnected: false,
	setIsConnected: (isConnected) => set({ isConnected }),

	lastCommand: null,
	setLastCommand: (command) => set({ lastCommand: command }),

	binStatus: null,
	setBinStatus: (status) => set({ binStatus: status }),
}));
