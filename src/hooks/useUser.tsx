import { getUserProfile } from "@/repository/user.service";
import { ProfileResponse, UserProfileInfo } from "@/types";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const useUser = () => {
  // const { userId } = useParams<{ userId: string }>();
  const [userInfo, setUserInfo] = useState<ProfileResponse | null>(null);

  useEffect(() => {
    const FetchUserProfile = async (uid: string) => {
      try {
        const userRef = await getUserProfile(uid);
        if (userRef) {
          console.log("user profile", userRef);
          setUserInfo(userInfo);
        } else {
          console.log("user not found");
        }
      } catch (error) {
        console.error("error fecthing user", error);
      }
    };
    FetchUserProfile();
  }, []);

  return {
    userInfo,
  };
};
