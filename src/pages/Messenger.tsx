import * as React from "react";
import { useEffect, useState } from "react";
import {
  Chat,
  // ChannelList,
  Channel as StreamChannel,
  Window,
  Thread,
  LoadingIndicator,
  ChannelHeader,
  MessageList,
  MessageInput,
  TypingIndicator,
  // ChannelSearch,
  // UnreadMessagesNotification,
} from "stream-chat-react";
import { StreamChat } from "stream-chat";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import styled from "styled-components";

import "stream-chat-react/dist/css/v2/index.css";
import { useUsername } from "@/contexts/UsernameContext";
import { useUserProfile } from "@/contexts/UserProfileContext";
import { searchUsers } from "@/repository/user.service";
import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
// import { collection, getDocs, query, where } from "firebase/firestore";
// import { db } from "@/firebase/firebaseConfig";

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
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<any>(null);

  // console.log("user");

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
        }

        setClient(chatClient);
      });
    };
    init();

    return () => {
      if (client) return () => client.disconnectUser();
    };
  }, [client]);

  const fetchSearchedUsers = async (searchTerm: string) => {
    try {
      const results: User[] = (await searchUsers(searchTerm)) || [];
      setSearchResults(results);
      console.log(searchResults);
    } catch (error) {
      console.error("error searching users", error);
    }
  };
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
    }

    fetchSearchedUsers(searchTerm);
  }, [searchTerm]);

  const startChat = async (id: string) => {
    if (client) {
      const members = [client.userID!, id];
      const uniqueMembers = Array.from(new Set(members));

      const channel = client?.channel("messaging", {
        members: uniqueMembers,
      });
      await channel.watch();
      setSelectedChannel(channel);
      console.log("started a chat with chanel", channel);
    }
  };

  if (!client || !firebaseUser)
    return (
      <main className="h-screen flex justify-center items-center">
        <LoadingIndicator />
      </main>
    );

  const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;

    @media (min-width: 768px) {
      flex-direction: row;
    }
  `;

  const SearchContainer = styled.div`
    display: flex;
    background: none;
    width: 100%;
    padding: 10px;

    @media (min-width: 768px) {
      width: 300px;
    }
  `;

  const SubContainer = styled.div`
    display: flex;
    flex-direction: column;
  `;
  const UserList = styled.ul`
    list-style: none;
    padding: 0;
    margin: 0;
    max-height: 300px;
    overflow-y: auto;

    li {
      display: flex;
      align-items: center;
      padding: 10px;
      cursor: pointer;

      &:hover {
        background-color: #f0f0f0;
      }
    }
  `;
  const ChatContainer = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;

    @media (max-width: 768px) {
      display: none; // Hide chat on mobile
    }
  `;

  return (
    <Chat client={client}>
      <Container>
        <SubContainer>
          <SearchContainer>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="search user"
              className="w-1/2 p-2 border rounded-lg bg-darkBg dark:text-slate-100 mb-4 bg-slate-100 "
            />
          </SearchContainer>
          <UserList>
            {searchResults.map((user) => (
              <li key={user.uid} onClick={() => startChat(user.uid)}>
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} />
                ) : (
                  <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                    {initials}
                  </div>
                )}
                <span>{user.displayName}</span>
              </li>
            ))}
          </UserList>
        </SubContainer>
        {/* <ChannelList filters={filters} sort={sort} /> */}
        <ChatContainer>
          {selectedChannel ? (
            <StreamChannel channel={selectedChannel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
              <TypingIndicator />
            </StreamChannel>
          ) : (
            <div>select a user to start chat</div>
          )}
        </ChatContainer>
      </Container>
    </Chat>
  );
};

export default Messenger;
