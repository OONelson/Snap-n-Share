import * as React from "react";
import { useEffect, useState } from "react";
import {
  Chat,
  ChannelList,
  Channel as StreamChannel,
  Window,
  Thread,
  LoadingIndicator,
  ChannelHeader,
  MessageList,
  MessageInput,
  TypingIndicator,
  ChannelSearch,
  UnreadMessagesNotification,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import styled from "styled-components";

import "stream-chat-react/dist/css/v2/index.css";
import { useUsername } from "@/contexts/UsernameContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { searchUsers } from "@/repository/user.service";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

const apikey = import.meta.env.VITE_STREAM_KEY;

const auth = getAuth();

const filters = { type: "messaging" };
const sort = { last_message_at: -1 };

interface IMessengerProps {}

const Messenger: React.FunctionComponent<IMessengerProps> = () => {
  const { username } = useUsername();
  const { displayName, initials } = useUserProfile();

  const [client, setClient] = useState<StreamChat | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);

  console.log("user");

  useEffect(() => {
    const init = async () => {
      const chatClient = StreamChat.getInstance(apikey);

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          setFirebaseUser(user);
          console.log("user", user);

          await chatClient.connectUser(
            {
              id: user.uid,
              name: displayName || username || "no name",
              image: user.photoURL || initials || undefined,
            },
            chatClient.devToken(user.uid)
          );
          console.log("user", user);

          // const channelInstance = chatClient.channel(
          //   "messaging",
          //   "general-group",
          //   {
          //     image:
          //       "https://www.bing.com/images/search?view=detailV2&ccid=33CwBYkm&id=E12494EFF47CDB15E6689F4D927983A08C9B2278&thid=OIP.33CwBYkmnMfpA9Djup22JwHaHa&mediaurl=https%3a%2f%2foneteamsolutions.in%2fblogoneteam%2fwp-content%2fuploads%2f2020%2f05%2fREACT-JS-KOCHI.png&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.df70b00589269cc7e903d0e3ba9db627%3frik%3deCKbjKCDeZJNnw%26pid%3dImgRaw%26r%3d0&exph=1024&expw=1024&q=react+image&simid=608045002147104382&FORM=IRPRST&ck=525B5794F6B546F859A5D685661F17A1&selectedIndex=1&itb=1",
          //     name: "general group",
          //     members: [user.uid],
          //   }
          // );

          // await channelInstance.watch();
        } else {
          if (client) return () => client.disconnectUser();
        }
        console.log("user", user);

        // setFirebaseUser(streamUser);
        setClient(chatClient);
      });
    };
    init();

    if (client) return () => client.disconnectUser();
  }, [client]);

  const handleSearchUser = async () => {
    await searchUsers(searchTerm);

    setSearchResults(searchResults);
  };

  const startChat = async (id: string) => {
    if (client) {
      const channel = client?.channel("messaging", {
        members: [client.userID!, id],
      });
      await channel.watch();
      setSelectedChannel(channel);
    }
  };

  if (!client || !firebaseUser) return <LoadingIndicator />;

  const Container = styled.div`
    display: flex;
  `;

  const SearchContainer = styled.div`
    width: 300px;
    padding: 10px;
  `;

  return (
    <Chat client={client}>
      <Container>
        <SearchContainer>
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="search user"
          />
          <Button onClick={handleSearchUser}>
            <FontAwesomeIcon icon={faSearch} />
          </Button>

          <ul>
            {searchResults.map((user) => (
              <li key={user?.uid}>{user.name}</li>
            ))}
          </ul>
        </SearchContainer>
        <ChannelList filters={filters} sort={sort} />
        <StreamChannel channel={selectedChannel}>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput />
          </Window>
          <Thread />
          <TypingIndicator />
        </StreamChannel>
      </Container>
    </Chat>
  );
};

export default Messenger;
