import * as React from "react";
import SideBar from "@/layout/SideBar";
import HomePosts from "@/layout/HomePosts";
import SideFooter from "@/layout/SideFooter";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  return (
    <main className="sm:grid lg:grid-cols-[210px,600px,300px] gap-0  md:grid-cols-[90px,500px,300px] ">
      <div className="md:block hidden ">
        <SideBar />
      </div>
      <div className="">
        <HomePosts />
      </div>
      <div className="md:hidden block ">
        <SideBar />
      </div>
      <div className="hidden md:hidden lg:block">
        <SideFooter />
      </div>
    </main>
  );
};

export default Home;
