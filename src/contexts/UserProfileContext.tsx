import { auth } from "@/firebase/firebaseConfig";
import { UserProfileInfo } from "@/types";
import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect } from "react";
import { createContext, useState, useContext, ReactNode } from "react";

interface UserProfileData {
	user: UserProfileInfo | null;
	loading: boolean;
}

const UserProfileContext = createContext<UserProfileData | null>(
	null
);

interface UserProfileProvider {
  children: ReactNode;
}

export const UserProfileProvider: React.FunctionComponent<{
	children: ReactNode;
}> = ({ children }) => {

	const [user, setUser] = useState<UserProfileInfo | null>(null);
	const [loading, setLoading]= useState(true);


	useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // Map Firebase's user object to your UserInfo type
        const userInfo: UserProfileInfo = {
          uid: authUser.uid,
          displayName: authUser.displayName,
          email: authUser.email,
          photoURL: authUser.photoURL,

        };
        setUser(userInfo);
      } else {
        setUser(null); // No user is signed in
      }
      setLoading(false); // Stop loading once the auth state is checked
    });

    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

	return (
		<UserProfileContext.Provider
			value={{ 
				user, loading
			}}
		>
			{!loading && children}
		</UserProfileContext.Provider>
	);
};

export const useUserProfile = (): UserProfileData=> {
	const context = useContext(UserProfileContext);
	if (!context) {
		throw new Error("useUsername must be used within a UsernameProvider");
	}
	return context;
};
