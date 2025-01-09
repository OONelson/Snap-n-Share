import SideBar from "@/layout/SideBar";
import * as React from "react";
import { useEffect, useState } from "react";

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
    <main className="h-screen w-screen bg-slate-100">
      <header
        className={`sticky top-0 md:my-4 mb-5 my-0 px-2 py-1 transition-all dark:bg-darkBg border-b ${
          isScrolled
            ? "backdrop-blur-md bg-white/70 shadow-md dark:bg-darkBg/70"
            : "bg-white/100 shadow-none"
        }`}
      >
        <h2>Notifications</h2>
      </header>
      <section className="w-screen">
        {notifications.map((notification) => (
          <article>
            <img src={notification.image} alt={notification.name} />

            <div>
              <h3>{notification.name}</h3>
              <p>{notification.content}</p>
            </div>
          </article>
        ))}
      </section>
      <SideBar />
    </main>
  );
};

export default Notifications;
