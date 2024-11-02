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
import { DocumentResponse, PhotoMeta, Post } from "@/types";
import { getPostByUserId } from "@/repository/post.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPen, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import BigModal from "@/components/reuseables/BigModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import SmallSpinner from "@/components/reuseables/SmallSpinner";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

type Tab = "Tab1" | "Tab2";

interface Post {
  id: string;
  caption?: string;
  photos: PhotoMeta[];
  likes?: number;
  userlikes: [];
  userId?: string | null;
  date?: Date;
}

const Profile: React.FunctionComponent<IProfileProps> = () => {
  const { user, logOut } = useUserAuth();
  const {
    userProfile,
    changeDisplayName,
    updateUsername,
    updateProfilePhoto,
    updateBio,
    initials,
  } = useUserProfile();

  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<Tab>("Tab1");

  const [newDisplayName, setNewDisplayName] = useState(
    userProfile?.displayName || ""
  );
  const [newUsername, setNewUsername] = useState(userProfile?.username || "");
  const [newBio, setNewBio] = useState(userProfile?.bio || "");
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [edit, setEdit] = useState<boolean>(false);

  const handleChangeTab = (tab: Tab) => {
    setActiveTab(tab);
  };

  const handleOpenEdit = () => {
    setEdit((prev) => !prev);
  };

  const handleUpdateProfile = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setLoading(true);
      setTimeout(() => {
        newDisplayName ? changeDisplayName : newDisplayName;
        newUsername ? updateUsername : newUsername;
        newBio ? updateBio : newBio;
        newPhoto ? updateProfilePhoto : newPhoto;
        alert("profile updated");
        setLoading(false);
        setEdit(false);
      }, 4000);
    } catch (error) {
      console.error(error);
      alert("error");
    }
  };

  // const getAllPosts = async (id: string) => {
  //   try {
  //     const querySnapshot = await getPostByUserId(id);
  //     const tempArr: DocumentResponse[] = [];
  //     if (querySnapshot.size > 0) {
  //       querySnapshot.forEach((doc) => {
  //         const posts = doc.data() as Post;
  //         const responseObj: DocumentResponse = {
  //           id: doc.id,
  //           ...posts,
  //         };
  //         console.log(responseObj);
  //         tempArr.push(responseObj);
  //       });

  //       setData(tempArr);
  //     } else {
  //       console.log("no such document");
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // useEffect(() => {
  //   if (user != null) {
  //     getAllPosts(user.uid);
  //   }
  // }, []);

  const fetchPosts = async (id: string) => {
    if (!user) return;

    setLoading(true);
    try {
      // const postsRef = collection(db, "posts");
      // const q = query(postsRef, where("userId", "==", user.uid)); // filter by current user's ID
      const querySnapshot = await getPostByUserId(id);

      const userPosts: Post[] = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as Post)
      );

      setPosts(userPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (user != null) {
      fetchPosts(user?.uid);
    }
  }, [user]);

  // const renderPost = () => {

  // };

  return (
    <main className="h-full flex justify-between items-center">
      <SideBar />
      {user ? (
        <Card className=" sm:w-full md:ml-20 md:w-fit lg:ml-56 lg:w-11/12 w-full px-2 border-none h-screen">
          <div className="flex justify-end items-center pt-2 md:pb-10">
            <Button className="h-8 w-20  md:block hidden" onClick={logOut}>
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
            <section className="grid grid-cols-3 auto-rows-min  gap-2 place-content-center w-full sm:w-4/5 md:pl-3">
              <CardTitle className="col-start-2 col-span-3 row-start-1 row-end-2 ">
                <span>{userProfile?.username}</span>
              </CardTitle>

              <picture className="pr-2 col-start-1 col-end-2 sm:w-96 row-start-2 row-end-3 w-auto">
                {/* {!userProfile?.photoURL ? ( */}
                <img
                  src={initials}
                  alt="initials"
                  className="sm:h-32 sm:w-32 h-24 w-34 rounded-full"
                />
                {/* ) : ( */}
                {/* <img
                    src={userProfile?.photoURL}
                    alt="profilephoto"
                    className="sm:h-32 sm:w-32 h-24 w-34 rounded-full"
                  />
                )} */}
              </picture>
              {/* <div className="w-full"> */}
              <p className="text-lg font-normal col-start-2 col-end-3 row-start-2 row-end-3">
                {/* {user.email} */}
                <span>0</span>
                Posts
              </p>
              <div className="col-start-3 col-end-4 row-start-2 row-end-3">
                <Button
                  onClick={handleOpenEdit}
                  className=" h-8 w-24 md:block hidden"
                >
                  Edit profile
                </Button>
                <FontAwesomeIcon
                  onClick={handleOpenEdit}
                  className="h-5 w-5 block md:hidden"
                  icon={faPen}
                />
              </div>
              {/* </div> */}

              {/* <CardDescription className="  w-20 flex flex-row"> */}
              <h2 className="col-start-1 col-end-2 row-start-3 row-end-3">
                displayName
              </h2>
              <p className="col-start-1 col-end-2 row-start-4 row-end-4">bio</p>
              {/* </CardDescription> */}
            </section>
            <div className="w-full flex justify-evenly mt-20 border-b-2">
              <h2 onClick={() => handleChangeTab("Tab1")}>Posts</h2>
              <h2 onClick={() => handleChangeTab("Tab2")}>Bookmarks</h2>
            </div>
            <article className="flex justify-center items-center mt-10">
              {activeTab === "Tab1" && (
                <div>
                  {posts.length > 0 ? (
                    posts.map((item) => {
                      return (
                        <div key={item.id} className="relative">
                          <div className="absolute group transition-all duration-200 bg-transparent hover:bg-slate-950 hover:bg-opacity-75 top-0 bottom-0 left-0 right-0 w-full h-full">
                            <div className="flex flex-col justify-center items-center w-full h-full">
                              {/* <HeartIcon className="hidden group-hover:block fill-white" /> */}
                              <div className="hidden group-hover:block text-white">
                                {item.likes} likes
                              </div>
                            </div>
                          </div>
                          <img src={item?.photos[0]?.cdnUrl} />
                        </div>
                      );
                    })
                  ) : (
                    <p>no paosts</p>
                  )}
                </div>
              )}

              {activeTab === "Tab2" && <div>Bookmark</div>}
            </article>
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
                <img src={initials} alt="profile" />
                {/* <Uploadle.done(({ cdnUrl }) => {
                        updateProfilePhoto(cdnUrl);
                      });
                    }careUploader
                  onFileSelect={(file) => {
                    if (file) {
                      fi
                  }}
                /> */}
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
                <Label htmlFor="username">username</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter a new username"
                  value={newUsername}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setNewUsername(e.target.value)
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
                <Button type="submit">
                  <span>Update</span>
                  {loading && <SmallSpinner />}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </BigModal>
      )}
    </main>
  );
};

export default Profile;
