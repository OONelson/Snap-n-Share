import { getUserProfile } from "@/repository/user.service";
import { UserProfileInfo } from "@/types";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const useUser = () => {
  const navigate = useNavigate();
  const { userId } = useParams<{ userId: string }>();
  const [selectedUser, setSelectedUser] = useState<UserProfileInfo | null>(
    null
  );

  const fetchUserProfile = async () => {
    try {
      if (userId) {
        const userRef = await getUserProfile(userId);
        if (userRef) {
          console.log("user profile", userRef);
          setSelectedUser(userRef);
          navigate(`profile/${userId}`);
        } else {
          console.log("user not found");
        }
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
