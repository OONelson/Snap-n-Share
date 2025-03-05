import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/contexts/UserProfileContext";
import SideBar from "@/layout/SideBar";
import WhoToFollow from "@/layout/WhoToFollow";
import { searchUsers } from "@/repository/user.service";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { User } from "firebase/auth";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface ISearchPageProps {}

const SearchPage: React.FunctionComponent<ISearchPageProps> = () => {
  const { userProfile, displayName, initials } = useUserProfile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const fetchSearchedUsers = async (searchTerm: string) => {
    try {
      const results: User[] = (await searchUsers(searchTerm)) || [];
      setSearchResults(results);
      console.log(searchResults);
    } catch (error) {
      console.error("error searching users", error);
    }
  };
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
    }

    fetchSearchedUsers(searchTerm);
  }, [searchTerm]);

  return (
    <main className="flex justify-between items-start h-screen  dark:bg-darkBg ">
      <div>
        <SideBar />
      </div>
      <section className="w-screen h-screen md:border-x px-2 border-r-2">
        <header
          className={`flex justify-between items-center pt-2 pb-2sticky top-0 md:my-4 my-0 px-2 py-1 transition-all dark:bg-darkBg border-b ${
            isScrolled
              ? "backdrop-blur-md bg-white/70 shadow-md dark:bg-darkBg/70"
              : "bg-white/100 shadow-none"
          }`}
        >
          <Link to="/profile">
            <div className="flex mr-2">
              {userProfile?.photoURL ? (
                <img
                  src={userProfile.photoURL}
                  alt={displayName}
                  className="rounded-full h-[50px] w-[50px]"
                />
              ) : (
                <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                  {initials}
                </div>
              )}
            </div>
          </Link>
          <Input
            type="search"
            placeholder="Search users"
            onChange={(e) => setSearchTerm(e.target.value)}
            className="md:w-[30vw] w-2/3 mr-2"
          />
          <Link to="/Settings">
            <FontAwesomeIcon
              icon={faCog}
              className="cursor-pointer text-slate-400 text-2xl"
            />
          </Link>
        </header>
        <article className="flex md:justify-center items-center">
          {searchResults ? (
            <ul>
              {searchResults.map((user) => (
                <li key={user.uid} className="flex items-center pt-2">
                  <div className="pr-2">
                    {user.photoURL ? (
                      <img
                        src={user.photoURL}
                        alt={user.displayName}
                        className="rounded-full h-[50px] w-[50px]"
                      />
                    ) : (
                      <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                        {initials}
                      </div>
                    )}
                  </div>
                  <span>{user.displayName}</span>
                </li>
              ))}
            </ul>
          ) : (
            <WhoToFollow />
          )}
        </article>
      </section>
      <div className="hidden md:block">
        <WhoToFollow />
      </div>
    </main>
  );
};

export default SearchPage;
