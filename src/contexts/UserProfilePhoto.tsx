import React from "react";
import { createContext, useState, useContext, ReactNode } from "react";

interface UserProfilePhotoData {
	capturedImage: string | null;
	setCapturedImage: (capturedImage: string | null) => void;
}

const UserProfilePhotoContext = createContext<UserProfilePhotoData | null>(
	null
);

export const UserProfilePhotoProvider: React.FunctionComponent<{
	children: ReactNode;
}> = ({ children }) => {
	const [capturedImage, setCapturedImage] = useState<string | null>(null);

	return (
		<UserProfilePhotoContext.Provider
			value={{ capturedImage, setCapturedImage }}
		>
			{children}
		</UserProfilePhotoContext.Provider>
	);
};

export const useUserProfilePhoto = (): UserProfilePhotoData => {
	const context = useContext(UserProfilePhotoContext);
	if (!context) {
		throw new Error("useUsername must be used within a UsernameProvider");
	}
	return context;
};
