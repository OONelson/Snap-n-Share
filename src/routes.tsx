import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/HomePage";
import Error from "./pages/Error";
import CreatePost from "./pages/CreatePost";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import ProtectedRoutes from "./pages/ProtectedRoutes";
import PasswordReset from "./pages/PasswordReset";
import CreateUsername from "./pages/CreateUsername";
import CreateProfilePhoto from "./pages/CreateProfilePhoto";
import Camera from "./pages/Camera";

export const router = createBrowserRouter([
	{
		element: <ProtectedRoutes />,
		children: [
			{
				path: "/",
				element: <Home />,
				errorElement: <Error />
			},
			{
				path: "/newpost",
				element: <CreatePost />,
				errorElement: <Error />
			},
			{
				path: "/profile",
				element: <Profile />,
				errorElement: <Error />
			}
		]
	},
	{
		path: "/create-username",
		element: <CreateUsername />,
		errorElement: <Error />
	},
	{
		path: "/camera",
		element: <Camera />,
		errorElement: <Error />
	},
	{
		path: "/create-profilephoto",
		element: <CreateProfilePhoto />,
		errorElement: <Error />
	},
	{
		path: "/login",
		element: <Login />,
		errorElement: <Error />
	},
	{
		path: "/signup",
		element: <Signup />,
		errorElement: <Error />
	},
	{
		path: "/forgot-password",
		element: <PasswordReset />,
		errorElement: <Error />
	}
]);
