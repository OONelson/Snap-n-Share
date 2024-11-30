import { Input } from "@/components/ui/input";
import SideBar from "@/layout/SideBar";
import WhoToFollow from "@/layout/WhoToFollow";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Link } from "react-router-dom";

interface ISearchPageProps {}

const SearchPage: React.FunctionComponent<ISearchPageProps> = () => {
  return (
    <main className="flex justify-between">
      <SideBar />
      <section className="w-[40vw] border-x px-2">
        <header className="flex justify-between">
          <Input
            type="search"
            placeholder="Search users"
            className="w-[35vw]"
          />
          <Link to="/Settings">
            <FontAwesomeIcon
              icon={faCog}
              size={"2x"}
              className="cursor-pointer"
            />
          </Link>
        </header>
      </section>
      <WhoToFollow />
    </main>
  );
};

export default SearchPage;
