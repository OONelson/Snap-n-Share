import { auth, db, storage } from "@/firebase/firebaseConfig";
import { UserProfileInfo } from "@/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect } from "react";
import { createContext, useState, useContext, ReactNode } from "react";

interface UserProfileData {
  userProfile: UserProfileInfo | null;
  email: string;
  userProfilePhotoURL?: string;
  changeDisplayName: (name: string) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateProfilePhoto: (file: File) => Promise<void>;
  updateBio: (bio: string) => Promise<void>;
  setUsername: (username: string) => Promise<void>;
  initials: string;
}

const UserProfileContext = createContext<UserProfileData | undefined>(
  undefined
);

interface UserProfileProvider {
  children: ReactNode;
}

const getInitials = (name?: string): string => {
  if (!name) return "";
  const initials = name
    .split(" ")
    .map((word) => word[0].toUpperCase())
    .join("");
  return initials.slice(0, 2);
};

export const UserProfileProvider: React.FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [userProfile, setUserProfile] = useState<UserProfileInfo | null>(null);

  const initials = getInitials(userProfile?.username);

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

  // HANDLE UPLOADCARE
  // const handleUpload = () => {
  //   const widget = uploadcare.openDialog(null, {
  //     publicKey: "your_uploadcare_public_key", // replace with your Uploadcare public key
  //     imagesOnly: true,
  //   });

  //   widget.done((fileInfo) => {
  //     const fileUrl = fileInfo.cdnUrl;
  //     setProfileImg(fileUrl);
  //     updateProfilePhoto(fileUrl);
  //   });
  // };

  const updateProfilePhoto = async (url: any) => {
    const user = auth.currentUser;
    if (user) {
      const storageRef = ref(storage, `profilephotos/${user.uid}`);
      await uploadBytes(storageRef, url);
      const photoURL = await getDownloadURL(storageRef);
      await setDoc(
        doc(db, "users", user.uid),
        { photoURL: url },
        { merge: true }
      );
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
        initials,
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
