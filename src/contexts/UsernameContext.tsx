import { db } from "@/firebase/firebaseConfig";
import { validateUsername } from "@/lib/usernameRegex";
import { UserProfileInfo } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import { createContext, ReactNode, useContext, useState } from "react";

interface UsernameData {
  userProfile: UserProfileInfo | null;
  username: string;
  setUsername: (username: string) => void;
  isAvailable: boolean | null;
  setIsAvailable: (isAvailable: boolean | null) => void;
  loading: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  handleCheckUsername: () => void;
}
const UsernameContext = createContext<UsernameData | undefined>(undefined);

interface UsernameProvider {
  children: ReactNode;
}

export const UsernameProvider: React.FunctionComponent<{
  children: ReactNode;
}> = ({ children }) => {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const isUsernameValid = (username: string): boolean => {
    return validateUsername(username);
  };

  const handleCheckUsername = async () => {
    setLoading(true);

    if (!isUsernameValid(username)) {
      setError("Invalid username, try something atleast 3 characters long");
      setLoading(false);
      setIsAvailable(null);
      return;
    }

    const usersRef = collection(db, "usernames");
    const q = query(usersRef, where("username", "==", username));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      setIsAvailable(true);
    } else {
      setIsAvailable(false);
    }
    setError(null);
    setLoading(false);
  };

  return (
    <UsernameContext.Provider
      value={{
        username,
        setUsername,
        loading,
        handleCheckUsername,
        isAvailable,
        setIsAvailable,
        setError,
        error,
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
