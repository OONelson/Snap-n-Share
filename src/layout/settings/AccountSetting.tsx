import * as React from "react";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { auth } from "@/firebase/firebaseConfig";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface IAccountSettingsProps {}

const AccountSettings: React.FunctionComponent<IAccountSettingsProps> = () => {
  const { userProfile, displayName, setDisplayName, initials } =
    useUserProfile();

  const user = auth.currentUser;
  return (
    <main className="bg-white md:w-full px-5 dark:bg-darkBg dark:text-slate-300">
      <h1 className="font-semibold text-xl py-3">Account Settings</h1>
      <section className="bg-stone-50 md:w-[50vw] p-5 rounded-xl dark:bg-darkBg border">
        <article className=" flex justify-start items-center">
          <picture>
            {userProfile?.photoURL ? (
              <img src={userProfile.photoURL} alt="userpic" />
            ) : (
              <div className="flex justify-center items-center w-20 h-20 rounded-full bg-black text-white col-start-1 col-end-2 row-start-2 row-end-3 font-bold text-3xl mr-2">
                {initials}
              </div>
            )}
          </picture>
          <Button className="h-8 px-2 bg-white text-black border-slate-300 hover:bg-stone-200 border">
            Change Photo
          </Button>
        </article>

        <div className="flex flex-col -space-y-1 pt-5">
          <span className="font-semibold text-xl">
            {userProfile?.displayName}
          </span>
          <span className="text-md">@{userProfile?.username}</span>
          <span className="text-slate-500 font-mono text-md">
            {user?.email}
          </span>
        </div>
      </section>

      <section className="md:w-1/3 1/2 pt-5 ">
        <h4 className="pb-5">Change details:</h4>
        <div>
          <Label
            className="text-slate-700 dark:text-slate-400"
            htmlFor="displayName"
          >
            Displayname
          </Label>
          <Input
            id="displayname"
            type="text"
            placeholder="Enter a new name"
            value={displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDisplayName(e.target.value)
            }
          />
        </div>

        <div>
          <Label className="text-slate-700 dark:text-slate-400" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter a new email"
            value={displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDisplayName(e.target.value)
            }
          />
        </div>

        <div>
          <Label
            className="text-slate-700 dark:text-slate-400"
            htmlFor="password"
          >
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Enter a new password"
            value={displayName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setDisplayName(e.target.value)
            }
          />
        </div>
      </section>
    </main>
  );
};

export default AccountSettings;
