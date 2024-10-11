import * as React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes";
import { UserAuthProvider } from "./contexts/UserAuthContext";
import { UsernameProvider } from "./contexts/UsernameContext";

interface IAppProps {}

const App: React.FunctionComponent<IAppProps> = () => {
	return (
		<>
			<UserAuthProvider>
				<UsernameProvider>
					<RouterProvider router={router} />
				</UsernameProvider>
			</UserAuthProvider>
		</>
	);
};

export default App;
