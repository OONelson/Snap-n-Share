import ThemeSelect from "@/components/reuseables/ThemeSelect";
import * as React from "react";

interface IAppearanceSettingsProps {}

const AppearanceSettings: React.FunctionComponent<
  IAppearanceSettingsProps
> = () => {
  // const [isToggled, setIsToggled] = useState(false);

  // const handleToggle = (value: boolean) => {
  //   setIsToggled(value);
  //   console.log("Toggle state:", value);
  // };
  return (
    <main className="p-5 w-full dark:bg-background dark:text-slate-300">
      <h1 className="font-normal text-xl py-3">Appearance settings</h1>

      <section className="w-[60vw] dark:bg-background dark:text-slate-300">
        <div className="md:w-1/2 flex justify-between items-center pt-5">
          <span>Turn on DarkMode</span>
          <div>
            {/* <Toggle enabled={isToggled} onToggle={handleToggle} />
             */}
            <ThemeSelect />
          </div>
        </div>
      </section>
    </main>
  );
};

export default AppearanceSettings;
