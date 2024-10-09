import * as React from "react";
import SideBar from "@/layout/SideBar";
import { motion } from "framer-motion";

interface IHomeProps {}

const Home: React.FunctionComponent<IHomeProps> = () => {
	return (
		<div>
			<SideBar />
		</div>
	);
};

export default Home;
