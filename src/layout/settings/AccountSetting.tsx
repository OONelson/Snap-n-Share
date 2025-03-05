import * as React from "react";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import CopyToClipboard from "@/components/reuseables/CopyToClipboard";
import { Link } from "react-router-dom";
import { useState } from "react";

interface IAccountSettingsProps {}

const AccountSettings: React.FunctionComponent<IAccountSettingsProps> = () => {
  const {
    userProfile,
    displayName,
    setDisplayName,
    initials,
    handleUpdateProfile,
    handleFileChange,
    handleImageClick,
    fileInputRef,
  } = useUserProfile();

  const email = userProfile?.email;

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      handleFileChange(e);
    }
  };

  // const handleResetPreview = () => {
  //   setPreviewImage(null);
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //     fileInputRef.current.files = null;
  //   }
  // };

  return (
    <main className="bg-white md:w-full px-5 dark:bg-darkBg dark:text-slate-300 flex flex-col justify-center items-center md:block">
      <h1 className="font-semibold text-xl py-3">Account Settings</h1>
      <section className="bg-stone-50 md:w-max w-[85vw] p-5 rounded-xl dark:bg-darkBg border flex flex-col justify-center items-center md:block px-3">
        <article className=" flex justify-start items-center">
          <picture onClick={handleImageClick}>
            {previewImage ? (
              <img
                src={previewImage}
                alt="Preview"
                style={{
                  width: "150px",
                  maxHeight: "150px",
                  objectFit: "cover",
                }}
              />
            ) : (
              <div>
                {userProfile?.photoURL ? (
                  <img
                    src={userProfile.photoURL}
                    alt="userpic"
                    className="rounded-full h-[150px] w-[150px]"
                  />
                ) : (
                  <div className="flex justify-center items-center w-20 h-20 rounded-full bg-black text-white col-start-1 col-end-2 row-start-2 row-end-3 font-bold text-3xl mr-2">
                    {initials}
                  </div>
                )}
              </div>
            )}
          </picture>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            onChange={handleImagePreview}
            className="mb-4 hidden"
          />
        </article>

        <div className="flex flex-col -space-y-1 pt-5">
          <span className="font-semibold text-xl">
            {userProfile?.displayName}
          </span>
          <span className="text-md">@{userProfile?.username}</span>
          <div className="flex items-center ">
            <span className="text-slate-500 font-mono text-md text-wrap flex-wrap pr-2">
              {email}
            </span>
            <CopyToClipboard textToCopy={email} />
          </div>
          <Link to="/settings/account/change-email">
            <span className="font-light underline">change email?</span>
          </Link>
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

        {/* <div>
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
        </div> */}

        <div>
          <Label
            className="text-slate-700 dark:text-slate-400 "
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
        <Button onClick={handleUpdateProfile} className="mt-3 h-9 w-20">
          Done
        </Button>
      </section>
    </main>
  );
};

export default AccountSettings;
