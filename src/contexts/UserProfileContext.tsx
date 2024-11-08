import { auth, db, storage } from "@/firebase/firebaseConfig";
import { UserProfileInfo } from "@/types";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";
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
  bio: string;
  setBio: (bio: string) => void;
  handleOpenEdit: () => MouseEventHandler<HTMLButtonElement>;
  handleCloseEdit: () => MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  initials: string;
  fetchBio: (bio: string) => Promise<string>;
  displayName: string;
  setDisplayName: (displayName: string) => void;
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

  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || ""
  );
  const [bio, setBio] = useState<string>(userProfile?.bio || "");

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

  // CHANGE DISPLAY NAME
  const changeDisplayName = async (displayName: string) => {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "displaynames", user.uid), {
        displayName: displayName,
        createdAt: serverTimestamp(),
      });
      await setDoc(
        doc(db, "users", user.uid),
        { displayName: displayName },
        { merge: true }
      );
      setUserProfile((prev) =>
        prev ? { ...prev, displayName: displayName } : null
      );
    }
  };

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

  //CHANGE BIO
  const updateBio = async (bio: string) => {
    const user = auth.currentUser;
    if (user) {
      await setDoc(doc(db, "bios", user.uid), {
        bio: bio,
        createdAt: serverTimestamp(),
      });
      await setDoc(doc(db, "users", user.uid), { bio }, { merge: true });
      setUserProfile((prev) => (prev ? { ...prev, bio } : null));
    }
  };

  const handleUpdateProfile = () => {
    try {
      displayName ? changeDisplayName : displayName;
      bio ? updateBio : bio;
      // newPhoto ? updateProfilePhoto : newPhoto;
      alert("profile updated");
      setEdit(false);
      // console.log();
    } catch (error) {
      console.error(error);
      alert("error");
    }
  };

  useEffect(() => {
    const fetchBio = async (): Promise<string> => {
      const user = auth.currentUser;
      // if (user) {
      //   setDoc(doc(db, "bios", user.uid), {
      //     bio: bio,
      //     createdAt: serverTimestamp(),
      //   }
      const userDoc = doc(db, "bios", user?.uid);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        setBio(userSnapshot.data().bio || "");
        // return bio;
      } else {
        return "";
      }
    };

    fetchBio();
  }, []);

  useEffect(() => {
    const fetchDisplayName = async (): Promise<string> => {
      const user = auth.currentUser;
      // if (user) {
      const userDoc = doc(db, "displaynames", user?.uid);
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        return userSnapshot.data().displayName || "";
      } else {
        return "";
      }
    };
    // };

    fetchDisplayName();
  }, []);

  return (
    <UserProfileContext.Provider
      value={{
        userProfile,

        handleUpdateProfile,
        edit,
        handleOpenEdit,
        handleCloseEdit,
        bio,
        setBio,
        initials,
        displayName,
        setDisplayName,
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
