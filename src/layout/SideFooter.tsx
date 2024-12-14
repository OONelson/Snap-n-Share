import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebook,
  faGithub,
  faInstagram,
} from "@fortawesome/free-brands-svg-icons";

const SideFooter: React.FC = () => {
  return (
    <nav className="bg-white w-[30vw] flex flex-col justify-start items-center sm:fixed sm:top-0 sm:right-0 sm:h-screen border md:block hidden dark:bg-darkBg px-3">
      <div className="h-screen flex  items-center flex-col">
        <div className="flex justify-center h-[20vh] space-x-4 mt-10">
          <a
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-700 hover:text-slate-800"
          >
            <FontAwesomeIcon
              icon={faFacebook}
              className="text-slate-700 hover:text-slate-800 text-2xl"
            />
          </a>

          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faInstagram}
              className="text-slate-700 hover:text-slate-800 text-2xl"
            />
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FontAwesomeIcon
              icon={faGithub}
              className="text-slate-700 hover:text-slate-800 text-2xl"
            />
          </a>
        </div>

        <div className="flex justify-center items-center w-[25vw]">
          <p className="text-slate-700 font-sans italic dark:text-slate-400">
            Our mission is to empower connections, foster authentic relationship
            by creating a digital platform where individuals and communities can
            express themselves, share meaningful moments
          </p>
        </div>
        <h1 className="font-semibold italic text-xl pt-5 dark:text-slate-200">
          Snap n' Share
        </h1>
      </div>
    </nav>
  );
};

export default SideFooter;
