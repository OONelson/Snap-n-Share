import { auth, db, storage } from "@/firebase/firebaseConfig";
import { UserProfileInfo } from "@/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, {
  ChangeEvent,
  MouseEventHandler,
  RefObject,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
import { createContext, useState, useContext, ReactNode } from "react";

interface UserProfileData {
  userProfile: UserProfileInfo | null;
  email: string;
  userProfilePhotoURL?: string;
  changeDisplayName: (name: string) => Promise<void>;
  updateUsername: (username: string) => Promise<void>;
  updateProfilePhoto: (file: File) => Promise<void>;
  updateBio: (bio: string) => Promise<void>;
  handleUpdateProfile: () => Promise<void>;
  edit: boolean;
  bio: string;
  setBio: React.Dispatch<SetStateAction<string>>;
  handleOpenEdit: () => MouseEventHandler<HTMLButtonElement>;
  handleCloseEdit: () => MouseEventHandler<HTMLButtonElement>;
  initials: string;
  fetchBio: (bio: string) => Promise<string>;
  displayName: string;
  setDisplayName: React.Dispatch<SetStateAction<string>>;
  handleFileChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleImageClick: () => void;
  fileInputRef: RefObject<HTMLInputElement>;
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
  const user = auth.currentUser;

  const [userProfile, setUserProfile] = useState<UserProfileInfo | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [file, setFile] = useState<File | null>(null);
  const [displayName, setDisplayName] = useState(
    userProfile?.displayName || ""
  );

  const [bio, setBio] = useState<string>(userProfile?.bio || "");

  const initials = getInitials(userProfile?.username);

  const handleOpenEdit: () => MouseEventHandler<HTMLButtonElement> = () => {
    setEdit(true);
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
    };
  };

  const handleCloseEdit: () => MouseEventHandler<HTMLButtonElement> = () => {
    setEdit(false);
    return (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
    };
  };

  // FETCH USER PROFILE
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (authUser) => {
      try {
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
            console.log("Authenticated user document not found.");
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // UPDATE PROFILE PIC
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      return;
    }

    if (!file) {
      alert("Please select a file and provide a caption.");
      return;
    }

    try {
      // Upload image to Firebase Storage
      const storageRef = ref(storage, `profileImages/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          console.error("Error during file upload:", error);
        },
        async () => {
          const photoURL = await getDownloadURL(uploadTask.snapshot.ref);
          console.log("File available at:", photoURL);

          await updateDoc(doc(db, "users", user.uid), {
            photoURL: photoURL,
          });

          // Reset form state

          alert("new picture uplaoded");
        }
      );
    } catch (error) {
      console.log("error uploading pic:", error);
    }
  };

  const fectchUserProfileImg = async (userId: string) => {
    try {
      const photoURLRef = doc(db, "users", userId);

      const docSnap = await getDoc(photoURLRef);

      if (docSnap.exists()) {
        return docSnap.data().photoURL;
      } else {
        console.log("no such doc");
        return "";
      }
    } catch (error) {
      console.log(error);
      return "";
    }
  };

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

        console.log("bio saved ", bio);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpdateProfile = async () => {
    await changeDisplayName(displayName);
    await updateBio(bio);
    await handleSubmit();
    alert("profile updated");

    setEdit(false);
  };

  const fetchDisplayName = async (userId: string) => {
    try {
      const displayNameRef = doc(db, "users", userId);

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
    if (user) {
      loadDisplayName();
      fetchDisplayName(user.uid);
      fetchBio(user.uid);
      fectchUserProfileImg(user.uid);
    }
  }, [user]);

  // FETCH BIO

  const fetchBio = async (userId: string) => {
    try {
      const bioRef = doc(db, "users", userId);

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
  }, []);
  const userProfileData: UserProfileData = {
    userProfile: userProfile,
    email: userProfile?.email || "",
    bio: userProfile?.bio || "",
    displayName: userProfile?.displayName || "",
    changeDisplayName: async () => {},
    updateUsername: async () => {},
    updateProfilePhoto: async () => {},
    edit,
    handleOpenEdit,
    handleUpdateProfile,
    setDisplayName: () => {},
    handleCloseEdit,
    handleImageClick,
    fileInputRef,
    handleFileChange,
    setBio,
    initials,
    updateBio,
    fetchBio,
  };
  return (
    <UserProfileContext.Provider value={userProfileData}>
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
