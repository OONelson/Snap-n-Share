import { auth, db } from "@/firebase/firebaseConfig";
import { UserProfileInfo } from "@/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { MouseEventHandler, SetStateAction, useEffect } from "react";
import { createContext, useState, useContext, ReactNode } from "react";
import { useParams } from "react-router-dom";

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
  setBio: React.Dispatch<SetStateAction<string>>;
  handleOpenEdit: () => MouseEventHandler<HTMLButtonElement>;
  handleCloseEdit: () => MouseEventHandler<HTMLButtonElement>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  initials: string;
  fetchBio: (bio: string) => Promise<string>;
  displayName: string;
  setDisplayName: React.Dispatch<SetStateAction<string>>;
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
  const { userId } = useParams<{ userId: string }>();

  const [userProfile, setUserProfile] = useState<UserProfileInfo | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

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
          const userData = userSnap.data();

          setUserProfile({
            user: {
              uid: authUser.uid,
              displayName: userData.displayName || "unknown",
              email: userData.email || "no email",
            },
            ...userData,
          } as UserProfileInfo);
        } else {
          console.log("not found");
        }
      } else {
        setUserProfile(null);
      }
    });

    setUserProfile(userProfile);

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     if (userId) {
  //       const userDoc = doc(db, "users", userId);
  //       const userSnap = await getDoc(userDoc);
  //       if (userSnap.exists()) {
  //         setUserProfile(userSnap.data() as UserProfileInfo);
  //       } else {
  //         console.error("Profile not found");
  //       }
  //       setUserProfile(userProfile);
  //     }
  //   };
  //   fetchProfile();
  // }, [userId]);

  const changeDisplayName = async (displayName: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        await updateDoc(userDocRef, {
          displayName,
        });

        console.log("display name saved ", displayName);
      }
    } catch (error) {
      console.error(error);
    }
  };

  //CHANGE BIO
  const updateBio = async (bio: string) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(db, "users", user.uid);

        await updateDoc(userDocRef, {
          bio,
        });
        // await setDoc(doc(db, "bios", userProfile?.uid), { bio });

        console.log("bio saved ", bio);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = async () => {
    await changeDisplayName(displayName);
    await updateBio(bio);
    alert("profile updated");
    console.log("updated");
    console.log(displayName);

    setEdit(false);
  };

  const fetchDisplayName = async () => {
    try {
      const displayNameRef = doc(db, "users", userProfile?.uid);

      const docSnap = await getDoc(displayNameRef);

      if (docSnap.exists()) {
        return docSnap.data().displayName;
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
      if (userProfile?.uid) {
        const uid = userProfile?.uid;
        setDisplayName(uid);
        const changeDisplayName = await fetchDisplayName(uid);
        setDisplayName(changeDisplayName || "");
      }
    };
    loadDisplayName();
    fetchDisplayName();
    fetchBio();
  }, []);

  // FETCH BIO

  const fetchBio = async (): Promise<string> => {
    try {
      const bioRef = doc(db, "users", userProfile?.uid);

      const docSnap = await getDoc(bioRef);

      if (docSnap.exists()) {
        return docSnap.data().bio;
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
      if (userProfile?.uid) {
        const uid = userProfile?.uid;
        setBio(uid);
        const updateBio = await fetchBio(uid);
        setBio(updateBio || "");
      }
    };

    loadBio();
    // handleUpdateProfile();
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
