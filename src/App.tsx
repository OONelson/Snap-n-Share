import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { UserProfilePhotoProvider } from "./contexts/UserProfilePhoto";
import { UserProfileProvider } from "./contexts/UserProfileContext";
import { UsernameProvider } from "./contexts/UsernameContext";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
  return (
    <>
      <UserAuthProvider>
        <UserProfileProvider>
          <UserProfilePhotoProvider>
            <UsernameProvider>
              <RouterProvider router={router} />
            </UsernameProvider>
          </UserProfilePhotoProvider>
        </UserProfileProvider>
      </UserAuthProvider>
    </>
  );
};

export default App;
