import { UserName } from "@/types";
import React from "react";
import { createContext, useContext } from "react";

interface IusernameProviderProps {
	children: React.ReactNode;
}

interface UsernameContextData extends UserName {
	setUsername: (username: string) => void;
}

const UsernameContext = createContext<UsernameContextData | undefined>(
	undefined
);

export const UsernameProvider: React.FC<IusernameProviderProps> = ({
	children
}) => {
	const [username, setUsername] = React.useState<string | number>("");

	const value: UsernameContextData = {
		username,
		setUsername
	};

	return (
		<UsernameContext.Provider value={value}>
			{children}
		</UsernameContext.Provider>
	);
};

export const useUsername = (): UsernameContextData => {
	const context = useContext(UsernameContext);
	if (!context) {
		throw new Error("useUsername must be used within a UsernameProvider");
	}
	return context;
};
