import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/contexts/UserProfileContext";
import SideBar from "@/layout/SideBar";
import WhoToFollow from "@/layout/WhoToFollow";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Link } from "react-router-dom";

interface ISearchPageProps {}

const SearchPage: React.FunctionComponent<ISearchPageProps> = () => {
  const { userProfile, displayName, initials } = useUserProfile();

  return (
    <main className="flex md:justify-between h-screen w-screen dark:bg-darkBg">
      <SideBar />
      <section className="w-screen md:border-x px-2">
        <header className="flex justify-between pt-2">
          <Link to="/profile">
            <div className="flex mr-2">
              {userProfile?.photoURL ? (
                <img src={userProfile.photoURL} alt={displayName} />
              ) : (
                <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold">
                  {initials}
                </div>
              )}
            </div>
          </Link>
          <Input
            type="search"
            placeholder="Search users"
            className="md:w-[35vw] w-2/3 mr-2"
          />
          <Link to="/Settings">
            <FontAwesomeIcon
              icon={faCog}
              size={"2x"}
              className="cursor-pointer text-slate-300"
            />
          </Link>
        </header>
      </section>
      <div className="hidden md:block">
        <WhoToFollow />
      </div>
    </main>
  );
};

export default SearchPage;
