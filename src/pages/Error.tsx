import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  fa4,
  fa0,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import RightArrowIcon from "@/components/assets/right-arrow.svg";
import { Link } from "react-router-dom";

interface IErrorProps {}

const Error: React.FunctionComponent<IErrorProps> = () => {
  return (
    <div className="h-full w-full flex flex-col justify-center items-center mt-48">
      <div className="flex justify-center mb-10">
        <FontAwesomeIcon icon={fa4} size="10x" />
        <FontAwesomeIcon icon={fa0} size="10x" />
        <FontAwesomeIcon icon={fa4} size="10x" />

        <div className="flex justify-end items-start flex-col -space-y-2 sm:block hidden">
          <FontAwesomeIcon icon={faExclamationTriangle} size="4x" color="red" />
          <p className="text-xl font-semibold">Page Not Found</p>
        </div>
      </div>
      <h1 className="text-3xl font-sans  font-medium pb-2">
        Dude! Where's my page?
      </h1>
      <Link
        className="flex justify-center items-center font-semibold text-lg text-gray-600 hover:text-gray-500 pr-1"
        to="/"
      >
        <span>Go back home</span>
        <img src={RightArrowIcon} alt="arrow" />
      </Link>
    </div>
  );
};

export default Error;
