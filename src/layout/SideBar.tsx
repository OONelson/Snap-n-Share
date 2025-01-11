import * as React from "react";
import HomeIcon from "@/components/assets/home-hover-home.svg";
import SearchIcon from "@/components/assets/magnifying-glass-solid.svg";
import ProfileIcon from "@/components/assets/account-hover-account.svg";
import MessageIcon from "@/components/assets/chat-hover-chat.svg";
import SettingIcon from "@/components/assets/settings.svg";
import AddIcon from "@/components/assets/add.svg";
import { Link, useLocation } from "react-router-dom";
import { usePosts } from "@/hooks/usePost";
import { useUserProfile } from "@/contexts/UserProfileContext";

interface ISideBarProps {}

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

const SideBar: React.FunctionComponent<ISideBarProps> = () => {
  const location = useLocation();

  const { initials } = usePosts();
  const { userProfile } = useUserProfile();
  return (
    <>
      <nav className=" sm:items-start sm:justify-between sm:flex-col sm:w-max sm:h-screen bg-white  border-x-2   flex items-center justify-center flex-row w-full mb-2 sm:mb-0 h-12 border fixed bottom-0 sm:fixed z-10 sm:top-0 sm:left-0 md:h-screen dark:bg-darkBg">
        <div>
          <h1 className="text-3xl font-sans font-bold text-gray-900 italic hidden lg:block dark:text-slate-100">
            Snap n' Share
          </h1>
        </div>
        <div className="sm:flex sm:flex-col lg:full flex flex-row w-max">
          {navItems.map((item) => (
            <div
              key={item.name}
              className={
                location.pathname === item.link
                  ? "sm:mb-10 bg-gray-900 text-slate-50 hover:bg-gray-800 rounded-md ease-in px-5 lg:pr-20 sm:py-2 w-max "
                  : "sm:mb-10 hover:dark:bg-gray-800 hover:bg-gray-100 px-5 sm:py-2 hover:rounded-md ease-in dark:text-slate-200"
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
                      ? "w-8 h-8 lg:w-10 lg:h-10  md:mr-3  invert dark:invert"
                      : "w-8 h-8 lg:w-10 lg:h-10 md:mr-3 invert-0 dark:invert"
                  }
                />
                <span className="text-xl hidden lg:block  ">{item.name}</span>
              </Link>
            </div>
          ))}
        </div>
        <div
          className={
            location.pathname === "/settings"
              ? "hidden sm:block sm:mb-10 bg-gray-900 text-slate-50 hover:bg-gray-800 rounded-md ease-in px-5 lg:pr-20 py-2 w-max"
              : "hidden sm:block sm:mb-10 hover:dark:bg-gray-800 hover:bg-gray-100 px-5  py-2 hover:rounded-md ease-in dark:text-slate-200"
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
                  ? "w-8 h-8 lg:w-10 lg:h-10  md:mr-3 flex justify-center items-center invert dark:invert"
                  : "w-8 h-8 lg:w-10 lg:h-10 md:mr-3 flex justify-center items-center  invert-0 dark:invert"
              }
            />
            <span className="text-xl hidden lg:block  ">Settings</span>
          </Link>
        </div>
      </nav>
    </>
  );
};

export default SideBar;
