import * as React from "react";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { useUserAuth } from "@/contexts/UserAuthContext";
import "./LogoutModal.css";

interface ILogoutModalProps {
  show: () => void;
  onClose: () => void;
}

const LogoutModal: React.FunctionComponent<ILogoutModalProps> = ({
  show,
  onClose,
}) => {
  const { logOut } = useUserAuth();

  if (!show) return null;
  return (
    <main className="modal-backdrop" onClick={onClose}>
      <article
        className="bg-white p-5 rounded-2xl md:max-w-96 max-w-60 w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-end justify-end pb-8 ">
          <FontAwesomeIcon
            onClick={onClose}
            icon={faTimes}
            className="cursor-pointer"
          />
        </div>
        <div className="-space-y-4">
          <h2 className="text-slate-500 md:font-medium pb-8 ">
            Sure you wanna log out of Snap n'Share?
          </h2>
        </div>
        <div className="flex justify-end items-center pt-8">
          <Button onClick={onClose} className="h-8 cursor-pointer mr-2">
            Cancel
          </Button>
          <Button
            onClick={logOut}
            className="h-8 cursor-pointer bg-red-600 hover:bg-red-500 "
          >
            <span className="pr-2">Logout</span>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </Button>
        </div>
      </article>
    </main>
  );
};

export default LogoutModal;
