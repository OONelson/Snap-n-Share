import { getUserProfile } from "@/repository/user.service";
import { ProfileResponse, UserProfileInfo } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const useUser = () => {
  const { userId } = useParams<{ userId: string }>();
  const [userProfile, setUserProfile] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    const FetchUserProfile = async () => {
      if (!userId) return;
      const userRef = await getUserProfile;
      setUserProfile(userRef);
    };

    FetchUserProfile();
  }, []);

  return {
    userProfile,
  };
};
