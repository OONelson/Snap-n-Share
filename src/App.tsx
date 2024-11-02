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
        <UserProfileProvider>
          <UsernameProvider>
            <RouterProvider router={router} />
          </UsernameProvider>
        </UserProfileProvider>
      </UserAuthProvider>
    </>
  );
};

export default App;
