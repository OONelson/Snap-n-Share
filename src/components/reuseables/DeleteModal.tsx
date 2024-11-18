import * as React from "react";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { usePosts } from "@/hooks/useUserPost";

interface IDeleteModalProps {}

const DeleteModal: React.FunctionComponent<IDeleteModalProps> = () => {
  const { closeDeleteModal, deletePost } = usePosts();
  return (
    <article onClick={closeDeleteModal}>
      <div className="relative ">
        <Button
          onClick={deletePost}
          className="absolute -right-2 h-8 bg-slate-100 text-red-600 hover:bg-slate-200"
        >
          <span>Delete</span>
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </div>
    </article>
  );
};

export default DeleteModal;
