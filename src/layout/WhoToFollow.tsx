import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import * as React from "react";

interface IWhoToFollowProps {}

const WhoToFollow: React.FunctionComponent<IWhoToFollowProps> = () => {
  const people = [
    {
      userImg: "src/components/assets/avatar.avif",
      displayName: "joe",
      username: "theBOYjoe",
    },
    {
      userImg: "src/components/assets/avatar.avif",
      displayName: "dylan",
      username: "theBOYdylan",
    },
    {
      userImg: "src/components/assets/avatar.avif",
      displayName: "athur",
      username: "theBOYauthur",
    },
  ];

  return (
    <section>
      <Card className="mt-5  w-max">
        <CardHeader>Who to follow</CardHeader>
        {people.map((person) => (
          <CardContent>
            <article className="flex justify-between items-center">
              <img
                src={person.userImg}
                alt="user"
                className="h-10 w-10 rounded-full"
              />
              <div className="flex flex-col justify-center items-start pr-5 pl-2 -space-y-2">
                <h2 className="font-bold text-xl">{person.displayName}</h2>
                <span className="text-slate-400">@{person.username}</span>
              </div>
              <Button className="h-8">Follow</Button>
            </article>
          </CardContent>
        ))}
      </Card>
    </section>
  );
};

export default WhoToFollow;
