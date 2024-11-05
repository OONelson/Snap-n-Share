import { auth, db, storage } from "@/firebase/firebaseConfig";
import { UserProfileInfo } from "@/types";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { MouseEventHandler, useEffect } from "react";
import { createContext, useState, useContext, ReactNode } from "react";

interface UserProfileData {
  userProfile: UserProfileInfo | null;
  email: string;
  userProfilePhotoURL?: string;
  changeDisplayName: (name: string) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateProfilePhoto: (file: File) => Promise<void>;
  updateBio: (bio: string) => Promise<void>;
  handleUpdateProfile: () => void;
  edit: boolean;
  // setEdit: (edit: boolean) => void;
  handleOpenEdit: () => MouseEventHandler<HTMLButtonElement>;
  handleCloseEdit: () => MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
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
  const [edit, setEdit] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [newDisplayName, setNewDisplayName] = useState(
    userProfile?.displayName || ""
  );
  const [bio, setBio] = useState<string>(userProfile?.bio || "");
  const [newBio, setNewBio] = useState(userProfile?.bio || "");
  const [newPhoto, setNewPhoto] = useState<File | null>(null);

  const initials = getInitials(userProfile?.username);

  const handleOpenEdit = () => {
    setEdit(true);
  };

  const handleCloseEdit = () => {
    setEdit(false);
  };

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

  const changeDisplayName = async (displayName: string) => {
    const user = auth.currentUser;
    user
      ? await setDoc(
          doc(db, "users", user.uid),
          { displayName: displayName },
          { merge: true }
        )
      : setUserProfile((prev) =>
          prev ? { ...prev, displayName: displayName } : null
        );
  };

  // const updateUsername = async (username: string) => {
  //   const user = auth.currentUser;
  //   if (user) {
  //     const usernameDoc = await getDoc(doc(db, "usernames", username));
  //     if (!usernameDoc.exists()) {
  //       await setDoc(doc(db, "users", user.uid), { username }, { merge: true });
  //       await setDoc(doc(db, "usernames", username), { uid: user.uid });
  //       setUserProfile((prev) => (prev ? { ...prev, username } : null));
  //     } else {
  //       throw new Error("Username already exists");
  //     }
  //   }
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
      setBio(bio);
    }
  };

  useEffect(() => {
    const fetchBio = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "users", user?.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userProfile = userSnapshot.data();
          setBio(userProfile.bio || "");
        }
      }
    };

    fetchBio();
  }, []);

  const handleUpdateProfile = () => {
    try {
      setIsLoading(true);
      setTimeout(() => {
        newDisplayName ? changeDisplayName : newDisplayName;
        // newUsername ? updateUsername : newUsername;
        newBio ? updateBio : newBio;
        newPhoto ? updateProfilePhoto : newPhoto;
        alert("profile updated");
        setIsLoading(false);
        setEdit(false);
      }, 4000);
    } catch (error) {
      console.error(error);
      alert("error");
    }
  };

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,
        changeDisplayName,
        // updateUsername,
        updateProfilePhoto,
        updateBio,
        handleUpdateProfile,
        edit,
        handleOpenEdit,
        handleCloseEdit,
        initials,
        isLoading,
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
