import { db } from "@/firebase/firebaseConfig";
import { validateUsername } from "@/lib/usernameRegex";
// import { UserProfileInfo } from "@/types";
import { collection, getDocs, query, where } from "firebase/firestore";
import {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface UsernameData {
  username: string;
  setUsername: React.Dispatch<SetStateAction<string>>;
  isAvailable: boolean | null;
  setIsAvailable: React.Dispatch<SetStateAction<boolean | null>>;
  loading: boolean;
  error: string | null;
  setError: React.Dispatch<SetStateAction<string | null>>;
  handleCheckUsername: () => Promise<void>;
  // userProfile: UserProfileInfo;
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

    const usersRef = collection(db, "users");
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

  const value = {
    username,
    setUsername,
    loading,
    handleCheckUsername,
    isAvailable,
    setIsAvailable,
    setError,
    error,
  };
  return (
    <UsernameContext.Provider value={value}>
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
