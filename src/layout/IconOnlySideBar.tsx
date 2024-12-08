import * as React from "react";
import HomeIcon from "@/components/assets/home-hover-home.svg";
import SearchIcon from "@/components/assets/magnifying-glass-solid.svg";
import ProfileIcon from "@/components/assets/account-hover-account.svg";
import MessageIcon from "@/components/assets/chat-hover-chat.svg";
import SettingIcon from "@/components/assets/settings.svg";
import AddIcon from "@/components/assets/add.svg";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface IIconOnlySideBarProps {}

const navItems = [
  {
    name: "Home",
    link: "/",
    icon: HomeIcon,
  },
  {
    name: "Search",
    link: "/search",
    icon: SearchIcon,
  },
  {
    name: "Messages",
    link: "/messenger",
    icon: MessageIcon,
  },
  {
    name: "Create",
    link: "/newpost",
    icon: AddIcon,
  },
  {
    name: "Profile",
    link: "/profile",
    icon: ProfileIcon,
  },
];

const IconOnlySideBar: React.FunctionComponent<IIconOnlySideBarProps> = () => {
  const location = useLocation();

  const navVariants = {
    hidden: { opacity: 0, x: -75 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 120,
      },
    },
  };
  return (
    <>
      <motion.nav
        variants={navVariants}
        initial="hidden"
        animate="visible"
        className="sm:flex sm:items-start sm:justify-between sm:flex-col  sm:h-screen bg-white  border-x-2  lg:pr-5 flex items-center justify-center flex-row w-min mb-2 sm:mb-0 h-12 border fixed bottom-0 md:sticky md:top-0 md:h-screen"
      >
        <div>
          <h1 className="text-3xl font-sans font-bold text-gray-900 italic hidden lg:block">
            S n'S
          </h1>
        </div>
        <div className="sm:flex sm:flex-col lg:full flex flex-row ">
          {navItems.map((item) => (
            <div
              key={item.name}
              className={
                location.pathname === item.link
                  ? "sm:mb-10 bg-gray-900 text-slate-50 hover:bg-gray-800 rounded-md ease-in px-5  sm:py-2 w-max"
                  : "sm:mb-10  hover:bg-gray-100 px-5 sm:py-2 hover:rounded-md ease-in"
              }
            >
              <Link
                to={item.link}
                className="flex justify-center items-center lg:justify-start lg:items-center "
              >
                <img
                  src={item.icon}
                  alt={item.name}
                  className={
                    location.pathname === item.link
                      ? "w-8 h-8 lg:w-10 lg:h-10  md:mr-3  invert"
                      : "w-8 h-8 lg:w-10 lg:h-10 md:mr-3 invert-0"
                  }
                />
              </Link>
            </div>
          ))}
        </div>
        <div
          className={
            location.pathname === "/settings"
              ? "hidden sm:block sm:mb-10 bg-gray-900 text-slate-50 hover:bg-gray-800 rounded-md ease-in px-5 lg:pr-20 py-2 w-max"
              : "hidden sm:block sm:mb-10  hover:bg-gray-100 px-5  py-2 hover:rounded-md ease-in"
          }
        >
          <Link
            to="/settings"
            className="flex justify-center items-center lg:justify-start lg:items-center "
          >
            <img
              src={SettingIcon}
              alt="settings"
              className={
                location.pathname === "/settings"
                  ? "w-8 h-8 lg:w-10 lg:h-10  md:mr-3 flex justify-center items-center invert"
                  : "w-8 h-8 lg:w-10 lg:h-10 md:mr-3 flex justify-center items-center  invert-0"
              }
            />
          </Link>
        </div>
      </motion.nav>
    </>
  );
};

export default IconOnlySideBar;
