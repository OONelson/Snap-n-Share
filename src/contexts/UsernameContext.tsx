import { db } from "@/firebase/firebaseConfig";
import { UserProfileInfo } from "@/types";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { createContext, ReactNode, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

interface UsernameData {
  userProfile: UserProfileInfo | null;
  username: string;
  setUsername: (username: string) => void;
  isAvailable: boolean;
  loading: boolean;
  handleCreateUsername: (username: string, uid: string) => Promise<void>;
  handleCheckUsername: () => void;
}
const UsernameContext = createContext<UsernameData | null>(null);

interface UsernameProvider {
  children: ReactNode;
}

export const UsernameProvider: React.FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  // const navigate = useNavigate();

  const [userProfile, setUserProfile] = useState<UserProfileInfo | null>(null);
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);

  const handleCheckUsername = async () => {
    const usersRef = collection(db, "usernames");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if(isAvailable) {
       "Username is available!" ;
    }else{
      "Username is already taken."
    }
    if (querySnapshot.empty) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }

    setLoading(false);
  };
  const handleCreateUsername = async (uid: string, username: string) => {
    handleCheckUsername();
    if (isAvailable) {
      await setDoc(doc(db, "usernames", uid), {
        uid: userProfile?.uid,
        username: username,
        timestamp: new Date(),
      });
      // navigate("/create-profilephoto");
    }
  };

  return (
    <UsernameContext.Provider
      value={{
        username,
        setUsername,
        loading,
        handleCreateUsername,
        handleCheckUsername,
        isAvailable,
      }}
    >
      {children}
    </UsernameContext.Provider>
  );
};

export const useUsername = (): UsernameData => {
  const context = useContext(UsernameContext);
  if (!context) {
    throw new Error("useUsername must be used within a UsernameProvider");
  }
  return context;
};
