import { auth, db, storage } from "@/firebase/firebaseConfig";
import { getUserProfile } from "@/repository/user.service";
import { getPostByUserId } from "@/repository/post.service";
import { DocumentResponse, UserProfileInfo } from "@/types";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import React, {
  MouseEventHandler,
  SetStateAction,
  useEffect,
  useRef,
} from "react";
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
  handleFileChange: () => void;
  handleImageClick: () => void;
  // fileInputRef: <HTMLInputElement>(null);
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
  const [userPosts, setUserPosts] = useState<DocumentResponse[]>([]);
  const [bio, setBio] = useState<string>(userProfile?.bio || "");

  const initials = getInitials(userProfile?.username);
  // const navigate = useNavigate();
  const { userId } = useParams();

  const handleOpenEdit = () => {
    setEdit(true);
  };

  const handleCloseEdit = () => {
    setEdit(false);
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

        if (userId) {
          const otherUserDoc = doc(db, "users", userId);
          const otherUserSnap = await getDoc(otherUserDoc);

          if (otherUserSnap.exists()) {
            setUserProfile({
              user: {
                uid: otherUserSnap.id,
                displayName: otherUserSnap.data().displayName || "unknown",
                email: otherUserSnap.data().email || "no email",
              },
            });
          } else {
            console.log("User document not found.");
            setUserProfile(null);
          }
        } else if (!authUser) {
          setUserProfile(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  // useEffect(() => {
  //   const fetchUserProfileData = async (userId: string) => {
  //     const profile = await getUserProfile(userId);
  //     setUserProfile(profile);

  //     const posts = await getPostByUserId(userId);
  //     setUserPosts(posts);
  //     console.log(posts);

  //     //  const followersList = await getUserFollowers(userId);
  //     //  setFollowers(followersList);

  //     //  const followingsList = await getUserFollowings(userId);
  //     //  setFollowings(followingsList);
  //   };

  //   fetchUserProfileData();
  // }, [userId]);

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

          // setFile(photoURL)
          // console.log(newPost);

          await updateDoc(doc(db, "users", user.uid), {
            photoURL: photoURL,
          });

          // Reset form state

          alert("new picture uplaoded");
          // navigate("/");
        }
      );
    } catch (error) {
      console.log("error uploading pic:", error);
    }
  };

  const fectchUserProfileImg = async () => {
    try {
      const photoURLRef = doc(db, "users", userProfile?.uid);

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
    fectchUserProfileImg();
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
        handleImageClick,
        fileInputRef,
        handleFileChange,
        bio,
        setBio,
        initials,
        displayName,
        setDisplayName,
        userPosts,
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
