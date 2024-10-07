import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faMessage, faUser } from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

interface ISideBarProps {}

const navItems = [
	{
		name: "Home",
		link: "/",
		icon: faHome
	},
	{
		name: "Messages",
		link: "/messages",
		icon: faMessage
	},
	{
		name: "Profile",
		link: "/profile",
		icon: faUser
	}
];

const SideBar: React.FunctionComponent<ISideBarProps> = () => {
	const pathname = useLocation();
	return (
		<>
			<nav className="flex justify-center items-start flex-col p-5 bg-white h-full w-[100]">
				<div>
					<h1 className="text-3xl font-sans font-bold text-gray-900 italic">
						Snap n' Share
					</h1>
				</div>
				<div>
					{navItems.map((item) => (
						<div key={item.name}>
							<Link to={item.link}>
								<FontAwesomeIcon icon={item.icon} />
								<span>{item.name}</span>
							</Link>
						</div>
					))}
				</div>
			</nav>
		</>
	);
};

export default SideBar;
