import * as React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "firebase/auth";
import SmallSpinner from "@/components/reuseables/SmallSpinner";

interface IProtectedRoutesProps {}

const ProtectedRoutes: React.FunctionComponent<IProtectedRoutesProps> = () => {
	const auth = getAuth();
	const [user, loading] = useAuthState(auth);
	// const location = useLocation();

	if (loading) {
		return (
			<div className="flex justify-center items-center">
				<SmallSpinner />
			</div>
		);
	}
	return user ? (
		<Outlet />
	) : (
		<Navigate
			to="./login"
			// state={{ from: location }}
		/>
	);
};

export default ProtectedRoutes;
