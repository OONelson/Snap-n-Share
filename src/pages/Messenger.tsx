import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ChatLayout from "@/layout/chatLayout";
import IconOnlySideBar from "@/layout/IconOnlySideBar";
import SideBar from "@/layout/SideBar";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";

interface IMessengerProps {}

const Messenger: React.FunctionComponent<IMessengerProps> = () => {
  const messages = [
    {
      userImg: "src/components/assets/avatar.avif",
      displayName: "joe",
      username: "theBOYjoe",
      message: "You shared a post",
      date: "nov 23, 2024",
    },
    {
      userImg: "src/components/assets/avatar.avif",
      displayName: "dylan",
      username: "theBOYdylan",
      message: "You shared a post",
      date: "nov 23, 2024",
    },
    {
      userImg: "src/components/assets/avatar.avif",
      displayName: "athur",
      username: "theBOYauthur",
      message: "You shared a post",
      date: "nov 23, 2024",
    },
  ];

  return (
    <main className="md:grid grid-cols-10 gap-0">
      <div className="hidden md:block col-span-1">
        <IconOnlySideBar />
      </div>
      <div className="block sm:hidden">
        <SideBar />
      </div>
      <Card className="h-screen md:col-span-9 lg:col-span-3 col-span-9 rounded-none">
        <CardHeader>Messages</CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-10 sm:w-[550px] lg:max-w-[400px]">
            <Input
              type="search"
              placeholder="Search Messages"
              className="sm:w-[500px] lg:max-w-[300px]"
            />
            <FontAwesomeIcon
              icon={faEllipsis}
              className="text-3xl cursor-pointer"
            />
          </div>

          <section>
            {messages.map((message) => (
              <article className="flex justify-between border-b py-3 px-1 transition-all cursor-pointer dark:hover:bg-slate-900 rounded-sm">
                {/* <Link> */}
                <div className="flex ">
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
                      <span className="text-slate-500 md:px-2 px-1">
                        {message.username}
                      </span>
                    </div>
                    <p className="ml-2">{message.message}</p>
                  </div>
                </div>
                .{message.date}
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
