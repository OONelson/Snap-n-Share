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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPen,
  faHeart as solidHeart,
  faBookmark as regularBookmark,
  faEllipsisV,
} from "@fortawesome/free-solid-svg-icons";
import {
  faHeart as regularHeart,
  faBookmark as solidBookmark,
} from "@fortawesome/free-regular-svg-icons";

import BigModal from "@/components/reuseables/BigModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import SmallSpinner from "@/components/reuseables/SmallSpinner";
import { usePosts } from "@/hooks/useUserPost";
import LogoutModal from "@/components/reuseables/LogoutModal";
import Dropdown from "@/components/reuseables/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import DeleteModal from "@/components/reuseables/DeleteModal";
import { DocumentResponse } from "@/types";
import { updateLikesOnPost } from "@/repository/post.service";
import PostComponent from "@/components/reuseables/PostComponent";

type Tab = "Tab1" | "Tab2";
interface IProfileProps {
  data: DocumentResponse;
}

const Profile: React.FunctionComponent<IProfileProps> = ({ data }) => {
  const { user } = useUserAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  // const [likesInfo, setLikesInfo] = useState<{
  //   likes: number;
  //   isLike: boolean;
  // }>({
  //   likes: data.likes,
  //   isLike: data.userlikes.includes(user!.uid) ? true : false,
  // });

  // const toggleLike = async (isVal: boolean) => {
  //   setLikesInfo({
  //     likes: isVal ? likesInfo.likes + 1 : likesInfo.likes - 1,
  //     isLike: !likesInfo.isLike,
  //   });
  //   isVal
  //     ? data.userlikes?.push(user!.uid)
  //     : data.userlikes?.splice(data.userlikes.indexOf(user!.uid), 1);

  //   await updateLikesOnPost(
  //     data.id,
  //     data.userlikes,
  //     isVal ? likesInfo.likes + 1 : likesInfo.likes - 1
  //   );
  // };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const {
    userProfile,
    handleUpdateProfile,
    edit,
    bio,
    setBio,
    displayName,
    setDisplayName,
    handleOpenEdit,
    handleCloseEdit,
    initials,
  } = useUserProfile();

  const {
    posts,
    loading,
    error,
    bookmarked,
    toggleBookmark,
    openDeleteModal,
    toggleDeleteModal,
  } = usePosts();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("Tab1");

  const handleChangeTab = (tab: Tab) => {
    setActiveTab(tab);
  };

  const [openLogout, setOpenLogout] = useState<boolean>(false);

  const handleOpenLogoutModal = () => {
    setOpenLogout(true);
  };
  const handleCloseLogoutModal = () => {
    setOpenLogout(false);
  };

  const handleSelect = (option: option) => {
    console.log(`Selected option: ${option.name}`);
    if (option.name === "Settings") {
      navigate("/settings");
    }
    if (option.name === "Logout") {
      setOpenLogout(true);
    }
  };

  const bookmarkedPosts = posts.filter((post) => bookmarked.includes(post.id));

  const renderPost = () => {
    return (
      <article className="flex flex-col justify-center items-center">
        {posts.length === 0 ? (
          <p>No post available</p>
        ) : (
          posts.map((post) => (
            <Card
              key={post.id}
              className="flex justify-start items-center mb-4 w-[90vw] lg:w-[30vw] sm:w-[45vw]"
            >
              <CardHeader>
                <div className="flex justify-between items-center w-full md:w-full ">
                  <Link to="/profile">
                    <div className="flex items-center justify-between w-full">
                      {userProfile?.photoURL ? (
                        <img src={userProfile.photoURL} alt={displayName} />
                      ) : (
                        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                          {initials}
                        </div>
                      )}

                      <span className="pl-2">{userProfile?.username}</span>
                    </div>
                  </Link>
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="text-gray-700 cursor-pointer hover:text-gray-950"
                    onClick={toggleDeleteModal}
                  />
                </div>
                {openDeleteModal && <DeleteModal />}
                <CardDescription className="ml-8">
                  <p>{post.caption}</p>
                </CardDescription>

                <CardContent>
                  <img
                    src={post.photos ? post.photos : ""}
                    alt={post.caption}
                    className="w-[400px] h-[300px] "
                  />
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <div>
                    <FontAwesomeIcon
                      className="cursor-pointer"
                      // onClick={() => toggleLike(!likesInfo.isLike)}
                      // icon={likesInfo.isLike ? solidHeart : regularHeart}
                      icon={regularHeart}
                    />
                    <span>{/* {likesInfo.likes} */}0</span>
                  </div>

                  <FontAwesomeIcon
                    className="cursor-pointer"
                    onClick={() => toggleBookmark(post.id)}
                    icon={
                      bookmarked.includes(post.id)
                        ? regularBookmark
                        : solidBookmark
                    }
                  />
                </CardFooter>
              </CardHeader>
            </Card>
          ))
        )}
      </article>
    );
  };

  return (
    <main className="h-full dark:bg-darkBg sm:grid lg:grid-cols-[210px,1370px] md:grid-cols-[90px,680px]">
      <div>
        <SideBar />
      </div>

      {user ? (
        <Card className=" w-full px-2 border-none h-full ">
          <div className=" flex justify-end items-center pt-2 md:pb-10">
            <Dropdown onSelect={handleSelect} />
            {/* LOGOUT MODAL */}

            {openLogout && (
              <LogoutModal
                show={handleOpenLogoutModal}
                onClose={handleCloseLogoutModal}
              />
            )}

            {/* LOGOUT MODAL END */}
          </div>
          <CardContent className="p-0 pt-10">
            <section className="grid grid-cols-3 auto-rows-min  gap-2 place-content-center w-full md:pl-3">
              <CardTitle className="col-start-2 col-span-3 row-start-1 row-end-2 ">
                <span>{userProfile?.username}</span>
              </CardTitle>
              {/* <div> */}
              {!userProfile?.photoURL ? (
                <div className="flex justify-center items-center w-20 h-20 rounded-full bg-slate-200 col-start-1 col-end-2 row-start-2 row-end-3 font-bold text-3xl dark:bg-darkBg dark:border-2">
                  {initials}
                </div>
              ) : (
                <picture className="pr-2 col-start-1 col-end-2 sm:w-96 row-start-2 row-end-3 w-auto">
                  <img
                    src={initials}
                    alt="initials"
                    className="sm:h-20 sm:w-20 h-20 w-20 rounded-full"
                  />
                </picture>
              )}
              {/* </div> */}
              <p className="text-lg font-normal col-start-2 col-end-3 row-start-2 row-end-3 mt-6">
                {/* {user.email} */}
                <span className="font-bold pr-2">{posts.length}</span>
                Posts
              </p>
              <div className="col-start-3 col-end-4 row-start-2 row-end-3 mt-6">
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
              <h2 className="col-start-1 col-end-2 row-start-3 row-end-3 font-semibold text-3xl">
                {/* {displayName} */}
                {userProfile?.displayName}
              </h2>
              <p className="-mt-2 col-start-1 col-end-2 row-start-4 row-end-4 text-slate-600 font-medium">
                {/* {bio} */}
                {userProfile?.bio}
              </p>
            </section>
            <div
              className={`sticky top-0 transition-all w-full flex justify-evenly mt-20 border-b-2 dark:bg-darkBg ${
                isScrolled
                  ? "backdrop-blur-md bg-white/70 shadow-md h-14 "
                  : "bg-white/100 shadow-none"
              }`}
            >
              <h2
                className={` cursor-pointer ${
                  activeTab === "Tab1" ? "font-extrabold" : "font-normal"
                } ${isScrolled ? "pt-4" : "pt-0"}`}
                onClick={() => handleChangeTab("Tab1")}
              >
                Posts
              </h2>
              <h2
                className={` cursor-pointer ${
                  activeTab === "Tab2" ? "font-extrabold" : "font-normal"
                } ${isScrolled ? "pt-4" : "pt-0"}`}
                onClick={() => handleChangeTab("Tab2")}
              >
                Bookmarks
              </h2>
            </div>
            <article className="h-min-[60vh] flex justify-center items-center pt-10 bg-slate-100">
              {activeTab === "Tab1" && (
                <div>{posts ? renderPost() : <SmallSpinner />}</div>
              )}

              {activeTab === "Tab2" && (
                <div className="w-[90vw] h-min-[60vh]  sm:w-[80vw] flex flex-col justify-center items-center overflow-x-hidden mb-14">
                  {bookmarked.length === 0 ? (
                    <p>No bookmarked posts found.</p>
                  ) : (
                    <>
                      {bookmarkedPosts.map((post) => (
                        <Card
                          key={post.id}
                          className="flex justify-start items-center mb-4 w-[90vw] lg:w-[30vw] sm:w-[45vw]"
                        >
                          <CardHeader>
                            <div className="flex justify-between items-center w-full md:w-full ">
                              <Link to="/profile">
                                <div className="flex items-center justify-between w-full">
                                  {userProfile?.photoURL ? (
                                    <img
                                      src={userProfile.photoURL}
                                      alt={displayName}
                                    />
                                  ) : (
                                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                                      {initials}
                                    </div>
                                  )}

                                  <span className="pl-2">
                                    {userProfile?.username}
                                  </span>
                                </div>
                              </Link>
                              <FontAwesomeIcon
                                icon={faEllipsisV}
                                className="text-gray-700 cursor-pointer hover:text-gray-950"
                                onClick={toggleDeleteModal}
                              />
                            </div>
                            {openDeleteModal && <DeleteModal />}
                            <CardDescription className="ml-8">
                              <p>{post.caption}</p>
                            </CardDescription>

                            <CardContent>
                              <img
                                src={post.photos ? post.photos : ""}
                                alt={post.caption}
                                className="w-[400px] h-[300px] "
                              />
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                              <div>
                                <FontAwesomeIcon
                                  className="cursor-pointer"
                                  // onClick={() =>
                                  //   toggleLike(!likesInfo.isLike)
                                  // }
                                  // icon={
                                  //   likesInfo.isLike
                                  //     ? solidHeart
                                  //     : regularHeart
                                  // }
                                  icon={regularHeart}
                                />
                                <span>{/* {likesInfo.likes} */}0</span>
                              </div>

                              <FontAwesomeIcon
                                className="cursor-pointer"
                                onClick={() => toggleBookmark(post.id)}
                                icon={
                                  bookmarked.includes(post.id)
                                    ? regularBookmark
                                    : solidBookmark
                                }
                              />
                            </CardFooter>
                          </CardHeader>
                        </Card>
                      ))}
                    </>
                  )}{" "}
                </div>
              )}
            </article>
          </CardContent>
        </Card>
      ) : (
        <h1>No user logged in </h1>
      )}

      {edit && (
        <BigModal show={handleOpenEdit} onClose={handleCloseEdit}>
          <Card>
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                change some stuff about your profile
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-end mb-5">
                {!userProfile?.photoURL ? (
                  <div className="flex justify-center items-center w-20 h-20 rounded-full bg-slate-200 col-start-1 col-end-2 row-start-2 row-end-3 font-bold text-3xl">
                    {initials}
                  </div>
                ) : (
                  <picture className="pr-2 col-start-1 col-end-2 sm:w-96 row-start-2 row-end-3 w-auto">
                    <img
                      src={initials}
                      alt="initials"
                      className="sm:h-20 sm:w-20 h-20 w-20 rounded-full"
                    />
                  </picture>
                )}
                <FontAwesomeIcon
                  className="h-5 w-5 block md:hidden"
                  icon={faPen}
                />
              </div>
              <Label htmlFor="displayname">Name</Label>
              <Input
                id="displayname"
                type="text"
                placeholder="Enter a new name"
                value={displayName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setDisplayName(e.target.value)
                }
              />
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Enter a new bio"
                value={bio}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setBio(e.target.value)
                }
              />{" "}
              <Label />
            </CardContent>
            <CardFooter>
              <Button onClick={handleUpdateProfile}>
                <span>Update</span>
              </Button>
            </CardFooter>
          </Card>
        </BigModal>
      )}
    </main>
  );
};

export default Profile;
