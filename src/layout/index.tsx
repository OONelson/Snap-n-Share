import * as React from "react";
import TopBar from "./TopBar";

interface ILayoutProps {}

const Layout: React.FunctionComponent<ILayoutProps> = () => {
	return (
		<section className="flex bg-white">
			<div>
				<TopBar />
			</div>
			<main></main>
			<div></div>
		</section>
	);
};

export default Layout;
