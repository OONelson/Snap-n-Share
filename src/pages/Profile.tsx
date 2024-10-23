import * as React from "react";
import { Button } from "../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import SideBar from "@/layout/SideBar";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { useUserAuth } from "@/contexts/UserAuthContext";
import { DocumentResponse, Post, PhotoMeta } from "@/types";
import { getPostByUserId } from "@/repository/post.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import BigModal from "@/components/reuseables/BigModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

type Tab = "Tab1" | "Tab2";

const Profile: React.FunctionComponent<IProfileProps> = () => {
  const { user, logOut } = useUserAuth();

  const [data, setData] = React.useState<DocumentResponse[]>([]);
  const [activeTab, setActiveTab] = React.useState<Tab>("Tab1");
  const { userProfile,
    changeDisplayName,
    updateUsername,
    updateProfilePhoto,
    updateBio,
    loading } = useUserProfile();

    const [newDisplayName, setNewDisplayName] = useState(userProfile?.displayName || '');
    const [newUsername, setNewUsername] = useState(userProfile?.username || '');
    const [newBio, setNewBio] = useState(userProfile?.bio || '');
    const [newPhoto, setNewPhoto] = useState<File | null>(null);
  
  const [profilePicture, setProfilePicture] = React.useState<File | null>(null);
  const [edit, setEdit] = React.useState<boolean>(false);

  const handleChangeTab = (tab: Tab) => {
    setActiveTab(tab);
  };

  const handleOpenEdit = () => {
    setEdit((prev) => !prev);
  };

  const handleUpdateProfile = async (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (newDisplayName) await changeDisplayName(newDisplayName);
      if (newUsername) await updateUsername(newUsername);
      if (newBio) await updateBio(newBio);
      if (newPhoto) await updateProfilePhoto(newPhoto);

      alert("profile updated");
    } catch (error) {
      console.error(error);
      alert("error");
    }
  };

  const getAllPosts = async (id: string) => {
    try {
      const querySnapshot = await getPostByUserId(id);
      const tempArr: DocumentResponse[] = [];
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Post;
          const responseObj: DocumentResponse = {
            id: doc.id,
            ...data,
          };
          console.log(responseObj);
          tempArr.push(responseObj);
        });

        setData(tempArr);
      } else {
        console.log("no such document");
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if (user != null) {
      getAllPosts(user?.uid);
    }
  }, []);

  const renderPosts = () => {
    return data.map((item) => {
      return (
        <div key={item.photos[0].uuid}>
          <img
            src={`${item.photos[0].cdnUrl}/-/progressive/yes/-scale/300x300/center/`}
          />
        </div>
      );
    });
  };

  return (
    <main className="flex h-full">
      <SideBar />
      {user ? (
        <Card className="flex flex-col sm:w-5/6 w-full px-2 border-none md:w-full">
          {/* <CardHeader>
					<CardTitle>
          
					</CardTitle>
          </CardHeader> */}
          <div className="flex justify-end items-center pt-2 md:pb-10">
            <Button
              className="h-8 w-20 sm:h-12 md:block hidden"
              onClick={logOut}
            >
              {" "}
              logout
            </Button>
            <FontAwesomeIcon
              className="block md:hidden h-5 w-5"
              onClick={logOut}
              icon={faRightFromBracket}
            />
          </div>
          <CardContent className="p-0 pt-10">
            <section className="flex flex-row justify-center items-center w-full sm:w-4/5">
              <div className="flex items-center justify-between sm:w-80 w-auto">
                <picture className="pr-2">
                  <img
                    src={user.photoURL}
                    alt="profilephoto"
                    className="sm:h-32 sm:w-32 h-24 w-34 rounded-full"
                  />
                </picture>
                <div className="flex justify-between items-center w-full">
                  <CardTitle>{user.displayName}</CardTitle>
                  <p className="text-lg font-normal">
                    {user.email}
                    <span>0</span>
                    Posts
                  </p>
                  <Button onClick={handleOpenEdit} className="h-8 w-24 sm:h-12 md:block hidden">
                    Edit profile
                  </Button>
                  <FontAwesomeIcon
                  onClick={handleOpenEdit}
                    className="h-5 w-5 block md:hidden"
                    icon={faPen}
                  />
                </div>

                <div className="flex justify-center items-center">
                  <CardDescription>
                    <h2>NAme</h2>
                    <p>bio</p>
                  </CardDescription>
                </div>
              </div>
            </section>
            <section className="flex mt-20">
              <div>
                <h2 onClick={() => handleChangeTab("Tab1")}>Posts</h2>
                <h2 onClick={() => handleChangeTab("Tab2")}>Bookmarks</h2>
              </div>
              <div>
                {activeTab === "Tab1" && (
                  <div>{data ? renderPosts() : <p>No posts yet</p>}</div>
                )}

                {activeTab === "Tab1" && <div>Bookmark</div>}
              </div>
            </section>
          </CardContent>
        </Card>
      ) : (
        <h1>No user logged in </h1>
      )}

      {edit && (
        <BigModal show={handleOpenEdit} onClose={handleOpenEdit}>
          <Card>
            <form onSubmit={handleUpdateProfile}>
              <CardHeader>
                <CardTitle>Edit Profile</CardTitle>
                <CardDescription>
                  change some stuff about your profile
                </CardDescription>
              </CardHeader>
              <CardContent>
                <img src={newPhoto} alt="profile" />
                <Label htmlFor="displayname">Name</Label>
                <Input
                  id="displayname"
                  type="text"
                  placeholder="Enter a new name"
                  value={newDisplayName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewDisplayName(e.target.value)
                  }
                />
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Enter a new bio"
                  value={newBio}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setNewBio(e.target.value)
                  }
                />{" "}
                <Label />
              </CardContent>
              <CardFooter>
                <Button type="submit">Update</Button>
              </CardFooter>
            </form>
          </Card>
        </BigModal>
      )}
    </main>
  );
};

export default Profile;
