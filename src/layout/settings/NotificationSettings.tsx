import * as React from "react";
import { useState } from "react";
import Toggle from "@/components/reuseables/Toggle";

interface INotificationSettingsProps {}

const NotificationSettings: React.FunctionComponent<
  INotificationSettingsProps
> = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = (value: boolean) => {
    setIsToggled(value);
    console.log("Toggle state:", value);
  };

  return (
    <main className="p-5 w-full dark:bg-background dark:text-slate-300">
      <h1 className="font-normal text-xl py-3">Notification settings</h1>

      <section className="w-[60vw]">
        <div className="md:w-1/2 flex justify-between items-center">
          <span>Push Notifications</span>
          <div>
            <Toggle enabled={isToggled} onToggle={handleToggle} />
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotificationSettings;
