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
    try {
      const user = auth.currentUser;
      const displayNameRef = doc(db, "users", user?.uid);
      await setDoc(displayNameRef, { displayName }, { merge: true });
      await setDoc(doc(db, "displaynames", user?.uid), { bio });

      console.log("display name saved ", displayName);
    } catch (error) {
      console.error(error);
    }
  };

  //CHANGE BIO
  const updateBio = async (bio: string) => {
    try {
      const user = auth.currentUser;
      const bioRef = doc(db, "users", user?.uid);
      await setDoc(bioRef, { bio }, { merge: true });
      await setDoc(doc(db, "bios", user?.uid), { bio });

      console.log("bio saved ", bio);
    } catch (error) {
      console.error(error);
    }
  };

  // const updateProfilePhoto = async (url: any) => {
  //   const user = auth.currentUser;
  //   if (user) {
  //     const storageRef = ref(storage, `profilephotos/${user.uid}`);
  //     await uploadBytes(storageRef, url);
  //     const photoURL = await getDownloadURL(storageRef);
  //     await setDoc(
  //       doc(db, "users", user.uid),
  //       { photoURL: url },
  //       { merge: true }
  //     );
  //     setUserProfile((prev) => (prev ? { ...prev, photoURL } : null));
  //   }
  // };

  const handleUpdateProfile = async () => {
    // displayName ? changeDisplayName : displayName;
    // bio ? updateBio : bio;
    // newPhoto ? updateProfilePhoto : newPhoto;
    // if () {
    await changeDisplayName(displayName);
    await updateBio(bio);
    alert("profile updated");
    console.log("updated");
    console.log(displayName);

    setEdit(false);
    // }
    // console.log();
  };

  const fetchDisplayName = async (userId: string): Promise<string> => {
    try {
      const displayNameRef = doc(db, "users", userId);

      const docSnap = await getDoc(displayNameRef);

      if (docSnap.exists()) {
        return docSnap.data().displayName;
        console.log(displayName);
      } else {
        console.log("no such doc");
        return "";
      }
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  useEffect(() => {
    const loadDisplayName = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        setDisplayName(uid);
        const changeDisplayName = await fetchDisplayName(uid);
        // setUserProfile(changeDisplayName || "");
        setDisplayName(changeDisplayName || "");
      }
    };
    loadDisplayName();
  }, []);

  // FETCH BIO

  const fetchBio = async (userId: string): Promise<string> => {
    try {
      const bioRef = doc(db, "users", userId);

      const docSnap = await getDoc(bioRef);

      if (docSnap.exists()) {
        return docSnap.data().bio;
        console.log(bio);
      } else {
        console.log("no such doc");
        return "";
      }
    } catch (error) {
      console.log(error);
      return "";
    }
  };

  useEffect(() => {
    const loadBio = async () => {
      const user = auth.currentUser;
      if (user) {
        const uid = user.uid;
        setBio(uid);
        const updateBio = await fetchBio(uid);
        // setUserProfile(changeDisplayName || "");
        setBio(updateBio || "");
      }
    };

    loadBio();
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
