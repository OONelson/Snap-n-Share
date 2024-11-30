import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowLeft,
  faUser,
  faBell,
  faGlobe,
  faEye,
  faRightFromBracket,
  faAngleRight,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import LogoutModal from "@/components/reuseables/LogoutModal";
import GeneralSettings from "@/layout/settings/GeneralSettings";
import AccountSettings from "@/layout/settings/AccountSetting";
import AppearanceSettings from "@/layout/settings/AppearanceSettings";
import NotificationSettings from "@/layout/settings/NotificationSettings";
import "../components/reuseables/tabs.css";
import SideFooter from "@/layout/SideFooter";
// import { Input } from "@/components/ui/input";

interface ISettingsProps {}

type Tab = {
  id: number;
  name: string;
  icon: any;
  content: any;
};

const tabs: Tab[] = [
  {
    id: 1,
    name: "General",
    icon: faGlobe,
    content: <GeneralSettings />,
  },
  {
    id: 2,
    name: "Account",
    icon: faUser,
    content: <AccountSettings />,
  },
  {
    id: 3,
    name: "Notifications",
    icon: faBell,
    content: <NotificationSettings />,
  },
  {
    id: 4,
    name: "Appearance",
    icon: faEye,
    content: <AppearanceSettings />,
  },
];

const Settings: React.FunctionComponent<ISettingsProps> = () => {
  const [activeTab, setActiveTab] = useState<number>(1);
  const [isPopupVisible, setPopupVisible] = useState(false);

  const [openLogout, setOpenLogout] = useState<boolean>(false);

  const handleChangeTab = (tabId: number) => {
    setActiveTab(tabId);

    if (window.innerWidth < 768) {
      setPopupVisible(true);
    }
  };

  const handleClosePopup = () => {
    setPopupVisible(false);
  };

  const handleOpenLogoutModal = () => {
    setOpenLogout(true);
  };
  const handleCloseLogoutModal = () => {
    setOpenLogout(false);
  };

  return (
    <main className="md:flex items-start w-fit">
      <nav className="md:w-64 sm:w-40 w-screen p-4 bg-stone-50 border-r-2 h-screen ">
        <header className="w-24 flex justify-between items-center">
          <FontAwesomeIcon
            icon={faArrowLeft}
            className="text-slate-700 cursor-pointer"
          />
          <h1 className="font-inter text-xl text-black">Settings</h1>
        </header>

        <ul className="py-16">
          {tabs.map((tab) => (
            <div
              onClick={() => handleChangeTab(tab.id)}
              key={tab.id}
              className={`${
                activeTab === tab.id
                  ? "md:bg-slate-300 md:hover:bg-slate-300"
                  : "md:bg-slate-50"
              }  sm:w-48 h-12 flex justify-between items-center cursor-pointer text-slate-600 bg-slate-100 hover:bg-slate-100 px-4 rounded-md mb-2 `}
            >
              <div>
                <FontAwesomeIcon
                  icon={tab.icon}
                  className=" pr-4 text-slate-600"
                />
                <span>{tab.name}</span>
              </div>
              <FontAwesomeIcon
                icon={faAngleRight}
                className="block md:hidden font-thin"
              />
            </div>
          ))}
        </ul>
        <div className="px-4 cursor-pointer">
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="text-slate-600 pr-4 "
          />
          <span
            className="text-red-600 font-semibold "
            onClick={handleOpenLogoutModal}
          >
            logout
          </span>
        </div>
        {openLogout && (
          <LogoutModal
            show={handleOpenLogoutModal}
            onClose={handleCloseLogoutModal}
          />
        )}
      </nav>
      <section>
        {tabs.map(
          (tab) =>
            activeTab === tab.id && (
              <article key={tab.id}>{tab.content}</article>
            )
        )}
      </section>

      {isPopupVisible && (
        <article className="md:hidden">
          <div className="popup-overlay" onClick={handleClosePopup}>
            <div className="popup-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={handleClosePopup}>
                <FontAwesomeIcon icon={faTimes} />
              </button>

              {activeTab === 1 && <GeneralSettings />}
              {activeTab === 2 && <AccountSettings />}
              {activeTab === 3 && <NotificationSettings />}
              {activeTab === 4 && <AppearanceSettings />}
            </div>
          </div>
        </article>
      )}
    </main>
  );
};

export default Settings;
