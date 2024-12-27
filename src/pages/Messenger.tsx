import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ChatLayout from "@/layout/chatLayout";
import IconOnlySideBar from "@/layout/IconOnlySideBar";
import SideBar from "@/layout/SideBar";
import { faCog, faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { useEffect, useState } from "react";

interface IMessengerProps {}

const Messenger: React.FunctionComponent<IMessengerProps> = () => {
  const messages = [
    {
      userImg: "src/components/assets/avatar.avif",
      displayName: "joe",
      username: "theBOYjoe",
      message: "You shared a post",
      date: "11/23/24",
    },
    {
      userImg: "src/components/assets/avatar.avif",
      displayName: "dylan",
      username: "theBOYdylan",
      message: "You shared a post",
      date: "11/23/24",
    },
    {
      userImg: "src/components/assets/avatar.avif",
      displayName: "athur",
      username: "theBOYauthur",
      message: "You shared a post",
      date: "11/23/24",
    },
  ];

  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
  };

  const shortUsername = "theBOYauthur";
  const truncated = truncateText(shortUsername, 8);
  const longerTruncated = truncateText(shortUsername, 15);

  const shortMessage = "You shared a post";
  const truncatedMessage = truncateText(shortMessage, 10);
  const longerTruncatedMessage = truncateText(shortMessage, 20);
  return (
    <main className="h-screen md:grid grid-cols-10 gap-0">
      <div className="hidden md:block col-span-1">
        <IconOnlySideBar />
      </div>
      <div className="block sm:hidden">
        <SideBar />
      </div>
      <Card className="h-full overflow-y-auto md:col-span-9 lg:col-span-3 col-span-9 rounded-none ">
        <CardHeader
          className={`flex flex-col justify-center items-between dark:bg-darkBg sticky top-0 transition-all border-b ${
            isScrolled
              ? "backdrop-blur-md bg-white/70 shadow-md dark:bg-darkBg/70"
              : "bg-white/100 shadow-none"
          }`}
        >
          <div className="flex justify-between items-center">
            <h3>Messages</h3>
            <FontAwesomeIcon icon={faCog} className="cursor-pointer" />
          </div>
          <div className="flex justify-between items-center mb-8 sm:w-[550px] lg:max-w-[340px] md:max-w-[340px]">
            <Input
              type="search"
              placeholder="Search Messages"
              className="sm:w-[500px] lg:w-[300px] md:w-[300px] mr-2 lg:mr-0"
            />
            <FontAwesomeIcon
              icon={faEllipsisVertical}
              className="text-2xl cursor-pointer"
            />
          </div>
        </CardHeader>

        <CardContent className="px-2 sm:px-3">
          <section>
            {messages.map((message) => (
              <article className=" h-full flex justify-between border-b py-3 px-1 transition-all cursor-pointer dark:hover:bg-slate-900 rounded-sm">
                {/* <Link> */}
                <div className="flex justify-between ">
                  <img
                    src={message.userImg}
                    alt={message.username}
                    className="h-10 w-10 rounded-full"
                  />
                  {/* </Link> */}
                  <div>
                    <div className="flex md:px-2 px-1">
                      <h2 className="font-bold text-xl">
                        {message.displayName}
                      </h2>
                      <span
                        title={shortUsername}
                        className="text-slate-500 md:px-2 px-1 hidden sm:block"
                      >
                        {longerTruncated}
                      </span>
                      <span
                        title={shortUsername}
                        className="text-slate-500 md:px-2 px-1 block sm:hidden"
                      >
                        {truncated}
                      </span>
                    </div>
                    <p
                      title={shortMessage}
                      className="ml-2 dark:text-slate-300 text-slate-600 hidden md:block"
                    >
                      {longerTruncatedMessage}
                    </p>
                    <p
                      title={shortMessage}
                      className="ml-2 dark:text-slate-300 text-slate-600 block md:hidden"
                    >
                      {truncatedMessage}
                    </p>
                  </div>
                </div>
                <span className="dark:text-slate-300 text-slate-500 ">
                  .{message.date}
                </span>
              </article>
            ))}
          </section>
        </CardContent>
      </Card>

      {/* <section className="dark:bg-darkBg dark:text-slate-200  justify-center items-center hidden lg:block col-span-6">
        <h1>start a convo</h1>
      </section> */}
      <ChatLayout />
    </main>
  );
};

export default Messenger;
