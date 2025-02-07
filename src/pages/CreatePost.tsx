import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePosts } from "@/hooks/usePost";
import SideBar from "@/layout/SideBar";

import { faArrowLeft, faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface ICreatePostProps {}

const CreatePost: React.FunctionComponent<ICreatePostProps> = () => {
  const navigate = useNavigate();

  const {
    handleSubmit,
    handleFileChange,
    handleImageClick,
    fileInputRef,
    post,
    setPost,
  } = usePosts();

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleImagePreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPreviewImage(URL.createObjectURL(file));
      handleFileChange(e);
    }
  };

  const handleResetPreview = () => {
    setPreviewImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      fileInputRef.current.files = null;
    }
  };

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <main className="dark:bg-darkBg h-screen bg-slate-100">
      <div className="md:pb-40">
        <FontAwesomeIcon
          onClick={handleGoBack}
          icon={faArrowLeft}
          className="cursor-pointer p-4 dark:text-slate-100"
        />
      </div>
      <div className="block sm:hidden">
        <SideBar />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center w-full dark:bg-darkBg"
      >
        <Card className="sm:w-2/5 w-4/5 lg:ml-40 md:ml-20 md:w-2/5 dark:bg-darkBg">
          <CardHeader>
            <CardTitle>Time to snap and share</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label>Snap caption</Label>
            <Textarea
              className="my-5 mb-5"
              id="caption"
              placeholder="what's in your snap"
              value={post.caption}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setPost({ ...post, caption: e.target.value })
              }
            />
            <div
              onClick={handleImageClick}
              style={{
                width: "300px",
                height: "150px",
                backgroundColor: "#f0f0f0",
                display: "flex",
                marginTop: "3rem",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                border: "2px dashed #ccc",
              }}
            >
              {previewImage ? (
                <div className="relative">
                  <FontAwesomeIcon
                    onClick={handleResetPreview}
                    icon={faTimes}
                    className="absolute top-0 right-0 bg-black text-white h-5 w-5 p-1 rounded-full"
                  />
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{
                      width: "300px",
                      maxHeight: "150px",
                      objectFit: "cover",
                    }}
                  />
                </div>
              ) : (
                <span className="text-slate-700">Click to upload photo</span>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleImagePreview}
              className="mb-4 hidden"
            />
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <Button className="px-8" type="submit">
              Post
            </Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
};

export default CreatePost;
