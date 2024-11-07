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
    <main className="modal-backdrop">
      <article className="modal-content flex flex-col">
        <div className="flex items-end justify-end pb-8">
          <FontAwesomeIcon onClick={onClose} icon={faTimes} />
        </div>
        <div>
          <h2 className="text-slate-500 font-medium">Sure you wanna logout?</h2>
        </div>
        <div className="flex justify-between items-center pt-8">
          <Button onClick={onClose} className="h-8 cursor-pointer">
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
