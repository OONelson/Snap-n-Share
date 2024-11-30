import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import IconOnlySideBar from "@/layout/IconOnlySideBar";
import * as React from "react";
import { Link } from "react-router-dom";

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
    <main className="flex">
      <IconOnlySideBar />
      <Card className="h-screen">
        <CardHeader>Messages</CardHeader>
        <CardContent className="-m-4">
          <div className="mb-10">
            <Input type="search" placeholder="Search Messages" />
          </div>

          <section>
            {messages.map((message) => (
              <article className="flex border-b mb-3 py-2">
                {/* <Link> */}
                <img
                  src={message.userImg}
                  alt={message.username}
                  className="h-10 w-10 rounded-full"
                />
                {/* </Link> */}
                <div>
                  <div className="flex md:px-2 px-1">
                    <h2 className="font-bold text-xl">{message.displayName}</h2>
                    <span className="text-slate-500 md:px-2 px-1">
                      {message.username}
                    </span>
                  </div>
                  {message.message}
                </div>
                .{message.date}
              </article>
            ))}
          </section>
        </CardContent>
      </Card>

      <section className="md:flex justify-center items-center hidden md:block">
        <h1>start a convo</h1>
      </section>
    </main>
  );
};

export default Messenger;
