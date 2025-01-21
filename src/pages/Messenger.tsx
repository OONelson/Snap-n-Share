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
import { Button } from "@/components/ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/firebase/firebaseConfig";

const apikey = import.meta.env.VITE_STREAM_KEY;

const auth = getAuth();

const filters = { type: "messaging" };
const sort = { last_message_at: -1 };

interface IMessengerProps {}

const Messenger: React.FunctionComponent<IMessengerProps> = () => {
  const { username } = useUsername();
  const { displayName, initials, userProfile } = useUserProfile();

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

  const handleSearchUser = async () => {
    // const results = (await searchUsers(searchTerm)) || [];
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("displayName", ">=", searchTerm),
      where("displayName", "<=", searchTerm + "\uf8ff")
    );
    const snapshot = await getDocs(q);
    const results: User[] = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    // console.log(doc.data());

    // console.log(results);

    setSearchResults(results);
    console.log(searchResults);
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
    display: block;

    @media (max-width: 768px) {
      display: flex;
    }
  `;

  const SearchContainer = styled.div`
    display: flex;
    background: none;
    width: 300px;
    padding: 10px;
  `;

  const SubContainer = styled.div`
    display: flex;
    flex-direction: column;
  `;

  return (
    <Chat client={client}>
      <Container>
        <SubContainer>
          <SearchContainer>
            <Input
              className="bg-slate-100"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="search user"
            />
            <Button onClick={handleSearchUser}>
              <FontAwesomeIcon icon={faSearch} />
            </Button>
          </SearchContainer>
          <ul>
            {searchResults.map((user) => (
              <li key={user.id} onClick={() => startChat(user.id)}>
                {userProfile?.photoURL ? (
                  <img src={userProfile.photoURL} alt={displayName} />
                ) : (
                  <div className="flex justify-center items-center w-10 h-10 rounded-full bg-black text-white  font-bold dark:border-2">
                    {initials}
                  </div>
                )}
                <span>
                  {username},{displayName}
                </span>
              </li>
            ))}
          </ul>
        </SubContainer>
        {/* <ChannelList filters={filters} sort={sort} /> */}
        <div className="hidden md:block">
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
        </div>
      </Container>
    </Chat>
  );
};

export default Messenger;
