import * as React from "react";
import SideBar from "@/layout/SideBar";
import HomePosts from "@/layout/HomePosts";
import SideFooter from "@/layout/SideFooter";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  return (
    <main className="sm:grid lg:grid-cols-[210px,500px,300px] gap-0 ">
      <div className="md:block hidden ">
        <SideBar />
      </div>
      <div className="-mt-4">
        <HomePosts />
      </div>
      <div className="md:hidden block ">
        <SideBar />
      </div>
      <div>
        <SideFooter />
      </div>
    </main>
  );
};

export default Home;
