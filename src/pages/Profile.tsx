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
  faBookmark as regularBookmark,
  faEllipsisV,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {
  faComment,
  faBookmark as solidBookmark,
} from "@fortawesome/free-regular-svg-icons";
import BigModal from "@/components/reuseables/BigModal";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import SmallSpinner from "@/components/reuseables/SmallSpinner";
import { usePosts } from "@/hooks/usePost";
import LogoutModal from "@/components/reuseables/LogoutModal";
import Dropdown from "@/components/reuseables/Dropdown";
import { Link, useNavigate } from "react-router-dom";
import CommentList from "@/components/reuseables/Commentlist";
import Likes from "@/components/reuseables/Likes";
import TimeReuse from "@/components/reuseables/TimeReuse";
import { useUser } from "@/hooks/useUser";

type Tab = "Tab1" | "Tab2";
interface IProfileProps {
  currentUserId: string;
}

const Profile: React.FunctionComponent<IProfileProps> = ({ currentUserId }) => {
  const { user } = useUserAuth();

  const [isScrolled, setIsScrolled] = useState(false);

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
    handleFileChange,
    handleImageClick,
    fileInputRef,
  } = useUserProfile();
  const { loading, error, userPosts } = useUser();
  const {
    posts,
    bookmarked,
    toggleBookmark,
    openDeleteModal,
    toggleDeleteModal,
    closeDeleteModal,
    deletePost,
    selectedPost,
    toggleCommentSection,
  } = usePosts();

  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<Tab>("Tab1");
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      handleFileChange(e);
    }
  };
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

  const handleSelect = (option: { name: string }) => {
    console.log(`Selected option: ${option.name}`);
    if (option.name === "Settings") {
      navigate("/settings");
    }
    if (option.name === "Logout") {
      setOpenLogout(true);
    }
  };

  const bookmarkedPosts = posts.filter((post) => bookmarked.includes(post.id!));

  if (loading) {
    return <SmallSpinner />;
  }

  if (error) {
    return <p>{error}</p>;
  }

  const renderPost = () => {
    return (
      <article className="flex flex-col justify-center items-center">
        {userPosts.length === 0 ? (
          <p>No post available</p>
        ) : (
          userPosts.map((post) => (
            <Card
              key={post.id}
              className="flex flex-col justify-start items-center mb-4 w-[90vw] lg:w-[30vw] sm:w-[45vw]"
            >
              <CardHeader className="flex justify-between w-full">
                <div className="flex justify-between items-center w-full md:w-full ">
                  <Link to="/profile">
                    <div className="flex items-center justify-between w-full">
                      {userProfile?.photoURL ? (
                        <img
                          src={userProfile.photoURL}
                          alt={displayName}
                          className="rounded-full h-[50px] w-[50px]"
                        />
                      ) : (
                        <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold">
                          {initials}
                        </div>
                      )}

                      <span className="ml-2 font-medium">
                        {userProfile?.displayName}
                      </span>
                      {userProfile!.username.length > 10 ? (
                        <span className="pl-1 text-slate-400 text-sm">
                          @{userProfile?.username?.substring(0, 10)}...
                        </span>
                      ) : (
                        <span className="pl-1 text-slate-400 text-sm">
                          @ {userProfile?.username}
                        </span>
                      )}
                    </div>
                  </Link>
                  {post.userId === user?.uid && (
                    <FontAwesomeIcon
                      icon={faEllipsisV}
                      className="text-gray-700 cursor-pointer hover:text-gray-950"
                      onClick={() => toggleDeleteModal}
                    />
                  )}
                </div>

                {openDeleteModal && (
                  <article onClick={closeDeleteModal}>
                    <div className="dark:bg-darkBg relative -mt-3">
                      <Button
                        onClick={() => deletePost}
                        className="absolute -right-2 h-8 bg-slate-100 text-red-600 hover:bg-slate-200 dark:bg-slate-900 border"
                      >
                        <span className="pr-1">Delete</span>
                        <FontAwesomeIcon icon={faTrash} />
                      </Button>
                    </div>
                  </article>
                )}
                <CardDescription className="ml-3">
                  <p>{post.caption}</p>
                </CardDescription>
              </CardHeader>

              <CardContent>
                <img
                  src={post.photos ? post.photos : ""}
                  alt={post.caption}
                  className="w-[400px] h-[300px] "
                />
              </CardContent>
              <CardFooter className="flex justify-between items-center w-full">
                <section className="flex justify-between items-center">
                  <div className="flex justify-between items-center w-[70px]">
                    <div className="flex justify-between items-center w-[30px]">
                      <Likes post={post} currentUserId={currentUserId} />
                    </div>

                    <div className="flex justify-between items-center w-[30px]">
                      <FontAwesomeIcon
                        className="cursor-pointer transition-all dark:hover:text-slate-400"
                        onClick={() => toggleCommentSection(post.id!)}
                        icon={faComment}
                      />
                      {Comment.length > 0 && <span>{Comment.length}</span>}
                    </div>
                  </div>

                  <FontAwesomeIcon
                    className="cursor-pointer transition-all dark:hover:text-slate-400"
                    onClick={() => toggleBookmark(post.id!)}
                    icon={
                      bookmarked.includes(post.id!)
                        ? regularBookmark
                        : solidBookmark
                    }
                  />
                </section>
                <TimeReuse createdAt={post.createdAt} />
              </CardFooter>
              {selectedPost === post.id && <CommentList postId={post.id} />}
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

      {userProfile ? (
        <Card className=" w-full px-2 border-none h-full ">
          <div className=" flex justify-end items-center pt-2 md:pb-10">
            <Dropdown onSelect={handleSelect} name={""} />
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
                <span>@{userProfile?.username}</span>
              </CardTitle>
              {/* <div> */}
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={displayName}
                  className="rounded-full h-[100px] w-[100px]"
                />
              ) : (
                <div className="flex justify-center items-center w-20 h-20 rounded-full bg-black text-white  font-bold">
                  {initials}
                </div>
              )}
              {/* </div> */}
              <div className="flex justify-between col-start-2 col-end-3 row-start-1 row-end-2  pt-5">
                <p className="text-lg font-normal col-start-2  mt-6">
                  {/* {user.email} */}
                  <span className="font-bold pr-2">{userPosts.length}</span>
                  Posts
                </p>
                <div className=" mt-6">
                  <Button
                    onClick={handleOpenEdit}
                    className=" h-8 w-24 md:block hidden cursor-pointer"
                  >
                    Edit profile
                  </Button>
                  <FontAwesomeIcon
                    onClick={handleOpenEdit}
                    className="h-5 w-5 block md:hidden cursor-pointer"
                    icon={faPen}
                  />
                </div>
              </div>
              <h2 className="col-start-1 col-end-3 row-start-3 row-end-3 font-semibold text-3xl">
                {/* {displayName} */}
                {userProfile?.displayName}
              </h2>
              <p className="-mt-2 col-start-1 col-end-3 row-start-4 row-end-4 text-slate-600 font-medium">
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
            <article className="h-min-[60vh] flex justify-center items-center pt-10 bg-slate-100 dark:bg-slate-900">
              {activeTab === "Tab1" && (
                <div>{userPosts ? renderPost() : <SmallSpinner />}</div>
              )}

              {activeTab === "Tab2" && (
                <div className="w-[90vw] h-min-[60vh]  sm:w-[80vw] flex flex-col justify-center items-center overflow-x-hidden mb-14 bg-slate-100 dark:bg-slate-900">
                  {bookmarked.length === 0 ? (
                    <p>No bookmarked posts found.</p>
                  ) : (
                    <>
                      {bookmarkedPosts.map((post) => (
                        <Card
                          key={post.id}
                          className=" mb-4 w-[90vw] lg:w-[30vw] sm:w-[45vw] p-0"
                        >
                          <CardHeader>
                            <div className="flex w-full md:w-full">
                              <Link to="/profile">
                                <div className="flex items-center justify-between w-full">
                                  {userProfile?.photoURL ? (
                                    <img
                                      src={userProfile.photoURL}
                                      alt={displayName}
                                      className="rounded-full h-[50px] w-[50px]"
                                    />
                                  ) : (
                                    <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                                      {initials}
                                    </div>
                                  )}

                                  <span className="pl-2">
                                    {post.displayName}
                                  </span>
                                  <span className="pl-1 text-slate-400 text-sm">
                                    @{post.username}
                                  </span>
                                </div>
                              </Link>
                              {post.userId === user?.uid && (
                                <FontAwesomeIcon
                                  icon={faEllipsisV}
                                  className="text-gray-700 cursor-pointer hover:text-gray-950"
                                  onClick={() => toggleDeleteModal}
                                />
                              )}
                            </div>
                            {openDeleteModal && (
                              <article onClick={closeDeleteModal}>
                                <div className="dark:bg-darkBg relative -mt-3">
                                  <Button
                                    onClick={() => deletePost}
                                    className="absolute -right-2 h-8 bg-slate-100 text-red-600 hover:bg-slate-200 dark:bg-slate-900 border"
                                  >
                                    <span className="pr-1">Delete</span>
                                    <FontAwesomeIcon icon={faTrash} />
                                  </Button>
                                </div>
                              </article>
                            )}
                            <CardDescription className="ml-3">
                              <p>{post.caption}</p>
                            </CardDescription>

                            <CardContent>
                              <img
                                src={post.photos ? post.photos : ""}
                                alt={post.caption}
                                className="w-[300px] h-[300px] "
                              />
                            </CardContent>
                            <CardFooter className="flex justify-between items-center">
                              <section className="flex justify-between items-center">
                                <div className="flex justify-between items-center w-[70px]">
                                  <div className="flex justify-between items-center w-[30px]">
                                    <Likes
                                      post={post}
                                      currentUserId={currentUserId}
                                    />
                                  </div>

                                  <div className="flex justify-between items-center w-[30px]">
                                    <Link to={`/post/${post.id}`}>
                                      <FontAwesomeIcon
                                        className="cursor-pointer transition-all dark:hover:text-slate-400"
                                        icon={faComment}
                                      />
                                    </Link>
                                    {Comment.length > 0 && (
                                      <span>{Comment.length}</span>
                                    )}
                                  </div>
                                </div>

                                <FontAwesomeIcon
                                  className="cursor-pointer transition-all dark:hover:text-slate-400"
                                  onClick={() => toggleBookmark(post.id!)}
                                  icon={
                                    bookmarked.includes(post.id!)
                                      ? regularBookmark
                                      : solidBookmark
                                  }
                                />
                              </section>
                              <TimeReuse createdAt={post.createdAt} />
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
              <article className=" flex  items-end">
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
                <FontAwesomeIcon
                  className="h-5 w-5 block md:hidden"
                  icon={faPen}
                  onClick={handleImageClick}
                />
              </article>
              {/* </div> */}
              <Label htmlFor="displayname">Name</Label>
              <Input
                id="displayname"
                type="text"
                placeholder="Enter a name"
                value={userProfile?.displayName}
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
