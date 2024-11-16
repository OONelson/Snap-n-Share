import * as React from "react";
import SideBar from "@/layout/SideBar";
import HomePosts from "@/layout/HomePosts";
// import SideFooter from "@/layout/SideFooter";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
  return (
    <main className="flex justify-between">
      <SideBar />
      <HomePosts />
    </main>
  );
};

export default Home;
