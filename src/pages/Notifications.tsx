import SideBar from "@/layout/SideBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface INotificationsProps {}

const Notifications: React.FunctionComponent<INotificationsProps> = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const notifications = [
    {
      id: 1,
      image: "src/components/assets/blank-pic.png",
      name: "dave",
      content: "liked your post",
    },
    {
      id: 2,
      image: "src/components/assets/blank-pic.png",
      name: "Tom",
      content: "commented on your post",
    },
    {
      id: 3,
      image: "src/components/assets/blank-pic.png",
      name: "stan",
      content: "followed you",
    },
    {
      id: 4,
      image: "src/components/assets/blank-pic.png",
      name: "dominic",
      content: "liked your post",
    },
    {
      id: 5,
      image: "src/components/assets/blank-pic.png",
      name: "dave",
      content: "commented on your post",
    },
  ];
  return (
    <main className="sm:grid grid-cols-8  w-full h-screen ">
      <div className="col-span-1">
        <SideBar />
      </div>
      <section className="flex flex-col md:col-span-7 col-span-8 ">
        <header
          className={`sticky top-0 md:my-4 mb-5 my-0 px-2 py-1 transition-all dark:bg-darkBg border-b ${
            isScrolled
              ? "backdrop-blur-md bg-white/70 shadow-md dark:bg-darkBg/70"
              : "bg-white/100 shadow-none"
          }`}
        >
          <h2>Notifications</h2>
        </header>
        <div className="px-2 md:px-4 pb-16">
          {notifications.map((notification) => (
            <article className="flex justify-start items-center py-5 border-t bg-slate-50/70">
              <img
                src={notification.image}
                alt={notification.name}
                className="w-20 rounded-full "
              />

              <div>
                <Link>
                  <h3 className="cursor-pointer">{notification.name}</h3>
                </Link>
                <p className="font-semibold">{notification.content}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      {/* <SideBar /> */}
    </main>
  );
};

export default Notifications;
