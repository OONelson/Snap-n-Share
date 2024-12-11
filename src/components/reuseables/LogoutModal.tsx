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
        className="bg-white rounded-2xl md:max-w-96 max-w-72 w-full dark:bg-darkBg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-end justify-between p-3 mb-8  dark:bg-slate-900 bg-slate-200 rounded-t-2xl">
          <h1 className="dark:text-slate-200 text-xl font-semibold">Logout?</h1>
          <FontAwesomeIcon
            onClick={onClose}
            icon={faTimes}
            className="cursor-pointer"
          />
        </div>
        <div className="px-3">
          <p className="text-slate-500 dark:text-slate-400 md:font-medium pb-8 ">
            Sure you wanna log out of Snap n'Share?
          </p>
        </div>
        <div className="flex justify-end items-center pt-5 p-3">
          <Button onClick={onClose} className="h-8 cursor-pointer mr-2">
            Cancel
          </Button>
          <Button
            onClick={logOut}
            className="h-8 cursor-pointer bg-red-700 hover:bg-red-500 "
          >
            <span className="pr-2 dark:text-slate-300">Logout</span>
            <FontAwesomeIcon
              icon={faRightFromBracket}
              className="dark:text-slate-300"
            />
          </Button>
        </div>
      </article>
    </main>
  );
};

export default LogoutModal;
