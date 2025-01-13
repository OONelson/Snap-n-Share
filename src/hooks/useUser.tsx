import { getUserProfile } from "@/repository/user.service";
import { UserProfileInfo } from "@/types";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useUser = () => {
  const navigate = useNavigate();
  const [selectedUser, setSelectedUser] = useState<UserProfileInfo | null>(
    null
  );

  const fetchUserProfile = async (uid: string) => {
    try {
      const userRef = await getUserProfile(uid);
      if (userRef) {
        console.log("user profile", userRef);
        setSelectedUser(userRef);
        navigate(`profile/${userRef.uid}`);
      } else {
        console.log("user not found");
      }
    } catch (error) {
      console.error("error fecthing user", error);
    }
  };

  return {
    selectedUser,
    fetchUserProfile,
  };
};
