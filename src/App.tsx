import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { UserProfilePhotoProvider } from "./contexts/UserProfilePhoto";
import { UserProfileProvider } from "./contexts/UserProfileContext";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
	return (
		<>
			<UserAuthProvider>
				<UserProfileProvider>
					<UserProfilePhotoProvider>
						<RouterProvider router={router} />
					</UserProfilePhotoProvider>
				</UserProfileProvider>
			</UserAuthProvider>
		</>
	);
};

export default App;
