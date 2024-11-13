import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { auth } from "@/firebase/firebaseConfig";
import * as React from "react";

interface IGeneralSettingsProps {}

const GeneralSettings: React.FunctionComponent<IGeneralSettingsProps> = () => {
  const {
    userProfile,
    // changeDisplayName,
    handleUpdateProfile,
    initials,
  } = useUserProfile();

  const user = auth.currentUser;
  return (
    <main className="bg-white w-screen">
      <h1 className="font-semibold text-xl">General Settings</h1>
      <section className="bg-slate-200 w-11/12 p-2">
        <article className=" flex justify-start items-center">
          <picture>
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="userpic" />
            ) : (
              <div className="flex justify-center items-center w-20 h-20 rounded-full bg-white col-start-1 col-end-2 row-start-2 row-end-3 font-bold text-3xl mr-2">
                {initials}
              </div>
            )}
          </picture>
          <Button className="h-8 px-2 bg-white text-black border-slate-300 border">
            Change Photo
          </Button>
        </article>

        <div className="flex flex-col">
          <span>{userProfile?.username}</span>
          <span className="font-semibold text-xl">
            {userProfile?.displayName}
          </span>
          <span>{user?.email}</span>
        </div>
      </section>
    </main>
  );
};

export default GeneralSettings;
