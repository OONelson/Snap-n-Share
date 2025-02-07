import * as React from "react";
import { BrowserRouter, RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import { UsernameProvider } from "./contexts/UsernameContext";
import ThemeProvider from "./contexts/ThemeContext";
import { ChakraProvider } from "@chakra-ui/react";

import "stream-chat-react/dist/css/v2/index.css";
interface IAppProps {}
const App: React.FunctionComponent<IAppProps> = () => {
  return (
    <>
      {/* <BrowserRouter> */}
      <ChakraProvider>
        <UserProfileProvider>
          <UserAuthProvider>
            <UsernameProvider>
              <ThemeProvider>
                <RouterProvider router={router} />
              </ThemeProvider>
            </UsernameProvider>
          </UserAuthProvider>
        </UserProfileProvider>
      </ChakraProvider>
      {/* </BrowserRouter> */}
    </>
  );
};

export default App;
