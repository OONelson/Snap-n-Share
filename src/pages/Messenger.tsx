import * as React from "react";
import { useEffect, useState } from "react";
import {
  Chat,
  Channel as StreamChannel,
  Window,
  Thread,
  LoadingIndicator,
  ChannelHeader,
  MessageList,
  MessageInput,
} from "stream-chat-react";
import { Channel, StreamChat } from "stream-chat";

import "stream-chat-react/dist/css/v2/index.css";
const apikey = import.meta.env.VITE_STREAM_KEY;

const user = {
  id: "123",
  name: "John",
  image: "src/components/assets/avatar.avif",
};

interface IMessengerProps {}

const Messenger: React.FunctionComponent<IMessengerProps> = () => {
  const [client, setClient] = useState<StreamChat | null>(null);
  const [channel, setChannel] = useState<Channel | null>(null);

  useEffect(() => {
    const init = async () => {
      const chatClient = StreamChat.getInstance(apikey);

      await chatClient.connectUser(user, chatClient.devToken(user.id));

      const channelInstance = chatClient.channel("messaging", "general-group", {
        image:
          "https://www.bing.com/images/search?view=detailV2&ccid=33CwBYkm&id=E12494EFF47CDB15E6689F4D927983A08C9B2278&thid=OIP.33CwBYkmnMfpA9Djup22JwHaHa&mediaurl=https%3a%2f%2foneteamsolutions.in%2fblogoneteam%2fwp-content%2fuploads%2f2020%2f05%2fREACT-JS-KOCHI.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.df70b00589269cc7e903d0e3ba9db627%3frik%3deCKbjKCDeZJNnw%26pid%3dImgRaw%26r%3d0&exph=1024&expw=1024&q=react+image&simid=608045002147104382&FORM=IRPRST&ck=525B5794F6B546F859A5D685661F17A1&selectedIndex=1&itb=1",
        name: "general group",
        members: [user.id],
      });

      await channelInstance.watch();

      setChannel(channelInstance);
      setClient(chatClient);
    };
    init();

    if (client) return () => client.disconnectUser();
  }, []);

  if (!channel || !client) return <LoadingIndicator />;

  return (
    <Chat client={client}>
      <StreamChannel channel={channel}>
        <Window>
          <ChannelHeader />
          <MessageList />
          <MessageInput />
        </Window>
        <Thread />
      </StreamChannel>
    </Chat>
  );
};

export default Messenger;
