import { faSmile } from "@fortawesome/free-regular-svg-icons";
import {
  faCamera,
  faEllipsis,
  faMicrophone,
  faPaperPlane,
  faPhotoFilm,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmojiPicker from "emoji-picker-react";
import * as React from "react";
import { useEffect, useState } from "react";

interface IChatLayoutProps {}

const ChatLayout: React.FunctionComponent<IChatLayoutProps> = () => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleClickEmoji = (e: { emoji: string }) => {
    setText((prev) => prev + e.emoji);
  };

  console.log(text);

  return (
    <main className="flex-1 flex flex-col md:w-[59vw] dark:bg-darkBg h-full">
      <article
        className={` justify-between px-2 py-2 sticky top-0 bg-inherit flex  pt-2 pb-2  my-0  transition-all dark:bg-darkBg border-b ${
          isScrolled
            ? "backdrop-blur-md bg-white/70 shadow-md dark:bg-darkBg/70"
            : "bg-white/100 shadow-none"
        }`}
      >
        <div className="flex justify-between items-center max-w-[250px] pb-2">
          <img
            src="src/components/assets/avatar.avif"
            alt="avatar"
            className="rounded-full h-12 w-12 mr-2"
          />
          <div>
            <h2 className="font-bold text-2xl dark:text-slate-200">Jon Doe</h2>
            <span className="text-slate-600">@jondoe</span>
          </div>
        </div>
        <FontAwesomeIcon
          icon={faEllipsis}
          className="text-3xl dark:text-slate-300"
        />
      </article>

      <section className="flex-1 overflow-y-auto dark:bg-darkBg flex flex-col gap-8 mb-20 bg-slate-50">
        <div className="lg:max-w-[60%] mt-2 p-3 dark:text-slate-300 flex ml-2 self-start justify-between">
          <img
            src="src/components/assets/avatar.avif"
            alt="avatar"
            className="rounded-full h-12 w-12 object-cover mr-2"
          />
          <div className="flex-1 flex flex-col ">
            <p className="dark:bg-slate-700 bg-slate-200  rounded-md p-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae,
              totam? Pariatur sapiente debitis earum nulla! Facilis perspiciatis
              ex voluptates aut, dolore a. Nam odit velit iure! Maxime quidem
              laboriosam non!
            </p>
            <span className="text-slate-400">1 min ago</span>
          </div>
        </div>

        <div className="lg:max-w-[60%] mt-2 p-3 rounded-md flex mr-2 justify-between self-end  dark:text-slate-300">
          {/* <img src="src/components/assets/avatar.avif" alt="avatar" /> */}
          <div>
            <img
              src="src/components/assets/download.jpg"
              alt="car"
              className="pb-2 lg:w-full rounded-md"
            />
            <p className="dark:bg-slate-700 bg-slate-200 rounded-md p-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae,
              totam? Pariatur sapiente debitis earum nulla! Facilis perspiciatis
              ex voluptates aut, dolore a. Nam odit velit iure! Maxime quidem
              laboriosam non!
            </p>
            <span className=" text-slate-400">1 min ago</span>
          </div>
        </div>

        <div className="lg:max-w-[60%] mt-2 p-3 dark:text-slate-300 flex ml-2 self-start justify-between">
          <img
            src="src/components/assets/avatar.avif"
            alt="avatar"
            className="rounded-full h-12 w-12 object-cover mr-2"
          />
          <div className="flex-1 flex flex-col ">
            <p className="dark:bg-slate-700 bg-slate-200  rounded-md p-2">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Vitae,
              totam? Pariatur sapiente debitis earum nulla! Facilis perspiciatis
              ex voluptates aut, dolore a. Nam odit velit iure! Maxime quidem
              laboriosam non!
            </p>
            <span className="text-slate-400">1 min ago</span>
          </div>
        </div>
      </section>

      <section className="flex items-center lg:bottom-1 lg:fixed px-3 dark:bg-slate-950 bg-white border-2 p-4 rounded-md">
        <div className="w-[120px] flex justify-between items-center">
          <FontAwesomeIcon
            icon={faPhotoFilm}
            size={"2x"}
            className="text-slate-500 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faCamera}
            size={"2x"}
            className="text-slate-500 cursor-pointer"
          />
          <FontAwesomeIcon
            icon={faMicrophone}
            size={"2x"}
            className="text-slate-500 cursor-pointer"
          />
        </div>
        <input
          type="text"
          name="text"
          placeholder="Type a message.."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-[30vw] px-4 py-2 bg-slate-200 lg:mx-4"
        />
        <div className="flex justify-between items-center w-[80px]">
          <div>
            <FontAwesomeIcon
              icon={faSmile}
              size={"2x"}
              onClick={() => setOpenEmoji((prev) => !prev)}
              className="text-slate-500 cursor-pointer"
            />
            {openEmoji && (
              <div className="transition-all fixed bottom-20 right-0">
                <EmojiPicker
                  // openEmoji={openEmoji}
                  onEmojiClick={handleClickEmoji}
                />
              </div>
            )}
          </div>
          <FontAwesomeIcon
            icon={faPaperPlane}
            size={"2x"}
            className="text-slate-500 cursor-pointer"
          />
        </div>
      </section>
    </main>
  );
};

export default ChatLayout;
