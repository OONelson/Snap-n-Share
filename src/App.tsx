import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import { UsernameProvider } from "./contexts/UsernameContext";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
  return (
    <>
      <UserAuthProvider>
        <UsernameProvider>
          <UserProfileProvider>
            <RouterProvider router={router} />
          </UserProfileProvider>
        </UsernameProvider>
      </UserAuthProvider>
    </>
  );
};

export default App;
