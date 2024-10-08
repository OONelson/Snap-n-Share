import * as React from "react";
import HomeIcon from "@/components/assets/home-hover-home.svg";
import ChatIcon from "@/components/assets/chat-hover-chat.svg";
import ProfileIcon from "@/components/assets/account-hover-account.svg";
import SettingIcon from "@/components/assets/settings.svg";
import AddIcon from "@/components/assets/add.svg";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

interface ISideBarProps {}

const navItems = [
	{
		name: "Home",
		link: "/",
		icon: HomeIcon
	},
	{
		name: "Messages",
		link: "/messages",
		icon: ChatIcon
	},
	{
		name: "Create",
		link: "/newpost",
		icon: AddIcon
	},
	{
		name: "Profile",
		link: "/profile",
		icon: ProfileIcon
	},
	{
		name: "Settings",
		link: "/settings",
		icon: SettingIcon
	}
];

const SideBar: React.FunctionComponent<ISideBarProps> = () => {
	const location = useLocation();

	const navVariants = {
		hidden: { opacity: 0, x: -75 },
		visible: {
			opacity: 1,
			x: 0,
			transition: {
				type: "spring",
				stiffness: 120
			}
		}
	};
	return (
		<>
			<motion.nav
				variants={navVariants}
				initial="hidden"
				animate="visible"
				dir="ltl"
				className="flex justify-between items-start flex-col bg-white h-full border-x-2 w-max lg:pr-5"
			>
				<div className="mb-20">
					<h1 className="text-3xl font-sans font-bold text-gray-900 italic hidden lg:block">
						Snap n' Share
					</h1>
				</div>
				<div className="w-max lg:full">
					{navItems.map((item) => (
						<div
							key={item.name}
							className={
								location.pathname === item.link
									? "mb-10 bg-gray-900 text-slate-50 hover:bg-gray-800 rounded-md ease-in px-5 lg:pr-20 py-2 w-max"
									: "mb-10  hover:bg-gray-100 px-5  py-2 hover:rounded-md ease-in"
							}
						>
							<Link
								to={item.link}
								className="flex justify-center items-center lg:justify-start lg:items-center "
							>
								<img
									src={item.icon}
									alt={item.name}
									className={
										location.pathname === item.link
											? "w-8 h-8 lg:w-10 lg:h-10  md:mr-3  invert"
											: "w-8 h-8 lg:w-10 lg:h-10 md:mr-3 invert-0"
									}
								/>
								<span className="text-xl hidden lg:block  ">{item.name}</span>
							</Link>
						</div>
					))}
				</div>
			</motion.nav>
		</>
	);
};

export default SideBar;
