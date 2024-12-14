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
import { useState } from "react";

interface IChatLayoutProps {}

const ChatLayout: React.FunctionComponent<IChatLayoutProps> = () => {
  const [openEmoji, setOpenEmoji] = useState(false);
  const [text, setText] = useState("");

  const handleClickEmoji = (e: { emoji: string }) => {
    setText((prev) => prev + e.emoji);
  };

  console.log(text);

  return (
    <main className="w-[60vw] dark:bg-darkBg">
      <article className="border-b border-slate-300 flex justify-between  px-2 py-2">
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
      <section className="flex items-center lg:bottom-5 lg:fixed px-3">
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
                  openEmoji={openEmoji}
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
