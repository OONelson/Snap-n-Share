import * as React from "react";
import SideBar from "@/layout/SideBar";
import HomePosts from "@/layout/HomePosts";
import SideFooter from "@/layout/SideFooter";
import ThemeSelect from "@/components/reuseables/ThemeSelect";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  return (
    <>
      <ThemeSelect />
      <main className="md:flex md:justify-between ">
        <div className="md:block hidden">
          <SideBar />
        </div>
        <HomePosts />
        <div className="md:hidden block">
          <SideBar />
        </div>
        {/* <div className="md:block hidden"> */}
        <SideFooter />
        {/* </div> */}
      </main>
    </>
  );
};

export default Home;
