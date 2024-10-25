import { auth, db, storage } from "@/firebase/firebaseConfig";
import { UserProfileInfo } from "@/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect } from "react";
import { createContext, useState, useContext, ReactNode } from "react";

interface UserProfileData {
  userProfile: UserProfileInfo | null;
  changeDisplayName: (name: string) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateProfilePhoto: (file: File) => Promise<void>;
  updateBio: (bio: string) => Promise<void>;
  setUsername: (username: string) => Promise<void>;
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
  const [userProfile, setUserProfile] = useState<UserProfileInfo | null>(null);

  // FETCH USER PROFILE
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      if (authUser) {
        const userDoc = doc(db, "users", authUser.uid);
        const userSnap = await getDoc(userDoc);

        if (userSnap.exists()) {
          setUserProfile(userSnap.data() as UserProfileInfo);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const changeDisplayName = async (name: string) => {
    const user = auth.currentUser;
    user
      ? await setDoc(
          doc(db, "users", user.uid),
          { displayName: name },
          { merge: true }
        )
      : setUserProfile((prev) =>
          prev ? { ...prev, displayName: name } : null
        );
  };

  const updateUsername = async (username: string) => {
    const user = auth.currentUser;
    if (user) {
      const usernameDoc = await getDoc(doc(db, "usernames", username));
      if (!usernameDoc.exists()) {
        await setDoc(doc(db, "users", user.uid), { username }, { merge: true });
        await setDoc(doc(db, "usernames", username), { uid: user.uid });
        setUserProfile((prev) => (prev ? { ...prev, username } : null));
      } else {
        throw new Error("Username already exists");
      }
    }
  };

  const updateProfilePhoto = async (file: File) => {
    const user = auth.currentUser;
    if (user) {
      const storageRef = ref(storage, `profilephotos/${user.uid}`);
      await uploadBytes(storageRef, file);
      const photoURL = await getDownloadURL(storageRef);
      await setDoc(doc(db, "users", user.uid), { photoURL }, { merge: true });
      setUserProfile((prev) => (prev ? { ...prev, photoURL } : null));
    }
  };

  const updateBio = async (bio: string) => {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "users", user.uid), { bio }, { merge: true });
      setUserProfile((prev) => (prev ? { ...prev, bio } : null));
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        changeDisplayName,
        updateUsername,
        updateProfilePhoto,
        updateBio,
      }}
    >
      {children}
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
