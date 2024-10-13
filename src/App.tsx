import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { UsernameProvider } from "./contexts/UsernameContext";
import { UserProfilePhotoProvider } from "./contexts/UserProfilePhoto";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
	return (
		<>
			<UserAuthProvider>
				<UsernameProvider>
					<UserProfilePhotoProvider>
						<RouterProvider router={router} />
					</UserProfilePhotoProvider>
				</UsernameProvider>
			</UserAuthProvider>
		</>
	);
};

export default App;
