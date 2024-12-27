import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import { UsernameProvider } from "./contexts/UsernameContext";
import ThemeProvider from "./contexts/ThemeContext";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
  return (
    <>
      <UserAuthProvider>
        <UserProfileProvider>
          <UsernameProvider>
            <ThemeProvider>
              <RouterProvider router={router} />
            </ThemeProvider>
          </UsernameProvider>
        </UserProfileProvider>
      </UserAuthProvider>
    </>
  );
};

export default App;
