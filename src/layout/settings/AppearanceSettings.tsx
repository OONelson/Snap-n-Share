import Toggle from "@/components/reuseables/Toggle";
import * as React from "react";
import { useState } from "react";

interface IAppearanceSettingsProps {}

const AppearanceSettings: React.FunctionComponent<
  IAppearanceSettingsProps
> = () => {
  const [isToggled, setIsToggled] = useState(false);

  const handleToggle = (value: boolean) => {
    setIsToggled(value);
    console.log("Toggle state:", value);
  };
  return (
    <main className="w-[60vw]">
      <h1>Appearance settings</h1>
      <div className="w-1/2 flex justify-between items-center">
        <span>Push Notifications</span>
        <div>
          <Toggle enabled={isToggled} onToggle={handleToggle} />
        </div>
      </div>
    </main>
  );
};

export default AppearanceSettings;
