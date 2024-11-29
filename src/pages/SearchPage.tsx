import { Input } from "@/components/ui/input";
import SideBar from "@/layout/SideBar";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

interface ISearchPageProps {}

const SearchPage: React.FunctionComponent<ISearchPageProps> = () => {
  return (
    <>
      <main>
        <SideBar />
        <section>
          <header className="flex ">
            <Input
              type="search"
              placeholder="Search users"
              className="w-[30vw]"
            />
            <FontAwesomeIcon icon={faCog} />
          </header>
        </section>
      </main>
    </>
  );
};

export default SearchPage;
