import FileUplaoder from "@/components/reuseables/FileUploader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  // CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { usePosts } from "@/hooks/useUserPost";

import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";

interface ICreatePostProps {}

const CreatePost: React.FunctionComponent<ICreatePostProps> = () => {
  const { handleSubmit, fileEntry, setFileEntry, post, setPost } = usePosts();

  return (
    <>
      <div className="md:pb-40">
        <FontAwesomeIcon icon={faArrowLeft} className="cursor-pointer p-4" />
      </div>
      <form
        onSubmit={handleSubmit}
        className="flex justify-center items-center w-full "
      >
        <Card className="sm:w-2/5 w-4/5 lg:ml-40 md:ml-20 md:w-2/5">
          <CardHeader>
            <CardTitle>Time to snap and share</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Label>Snap caption</Label>
            <Textarea
              className="my-5"
              id="caption"
              placeholder="what's in your snap"
              value={post.caption}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setPost({ ...post, caption: e.target.value })
              }
            />
            <FileUplaoder
              fileEntry={fileEntry}
              onChange={setFileEntry}
              preview={true}
            />
          </CardContent>
          <CardFooter className="flex justify-center items-center">
            <Button className="px-8" type="submit">
              Post
            </Button>
          </CardFooter>
        </Card>
      </form>
    </>
  );
};

export default CreatePost;
