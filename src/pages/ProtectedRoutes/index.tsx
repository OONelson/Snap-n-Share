import * as React from "react";
import { Navigate, useLocation, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";

interface IProtectedRoutesProps {}

const ProtectedRoutes: React.FunctionComponent<IProtectedRoutesProps> = () => {
	const auth = getAuth();
	const [user, loading] = useAuthState(auth);
	const location = useLocation();

	if (loading) {
		return <div>...loading</div>;
	}
	return user ? (
		<Outlet />
	) : (
		<Navigate to="./login" state={{ from: location }} />
	);
};

export default ProtectedRoutes;
