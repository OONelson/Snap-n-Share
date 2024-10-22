import { auth, db, storage } from "@/firebase/firebaseConfig";
import { UserProfileInfo } from "@/types";
import { updateProfile } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect } from "react";
import { createContext, useState, useContext, ReactNode } from "react";

interface UserProfileData {
  user: UserProfileInfo | null;
  updateProfile: (profileData: Partial<UserProfileInfo>) => Promise<void>;
  uploadProfilePicture: (file: File) => Promise<string>;
  loading: boolean;
}

const UserProfileContext = createContext<UserProfileData | undefined>(
  undefined
);

interface UserProfileProvider {
  children: ReactNode;
}

export const UserProfileProvider: React.FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<UserProfileInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userDoc = doc(db, "users", authUser.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setUser(userSnap.data() as UserProfileInfo);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe(); 
  }, []);



	const uploadProfilePicture = async (file: File): Promise<string> => {
    if (!user) throw new Error("User not authenticated");

    const fileRef = ref(storage,`profilePictures/${user.uid}`);
    await uploadBytes(fileRef, file);
    const profilePhotoURL = await getDownloadURL(fileRef);

    await updateProfile({ profilePhotoURL });
    return profilePhotoURL;
  };

	
  return (
    <UserProfileContext.Provider
      value={{
        user,
				updateProfile,
				uploadProfilePicture,
        loading,
      }}
    >
      {!loading && children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = (): UserProfileData => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error("useUsername must be used within a UsernameProvider");
  }
  return context;
};
