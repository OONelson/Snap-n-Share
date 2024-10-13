import {
	createUserWithEmailAndPassword,
	User,
	GoogleAuthProvider,
	onAuthStateChanged,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut
} from "firebase/auth";
import { createContext, useState, useEffect, useContext } from "react";
import { auth } from "../firebase/firebaseConfig";

interface IuserAuthProviderProps {
	children: React.ReactNode;
}

type AuthContextData = {
	currentUser: User | null;
	logIn: typeof logIn;
	signUp: typeof signUp;
	logOut: typeof logOut;
	googleSignIn: typeof googleSignIn;
};

const logIn = (email: string, password: string) => {
	signInWithEmailAndPassword(auth, email, password);
};

const signUp = (email: string, password: string) => {
	createUserWithEmailAndPassword(auth, email, password).then((currentUser) => {
		console.log(currentUser);
		alert(currentUser);
	});
};

const logOut = () => {
	signOut(auth);
};

const googleSignIn = () => {
	const googleAuthProvider = new GoogleAuthProvider();
	signInWithPopup(auth, googleAuthProvider);
};

export const UserAuthContext = createContext<AuthContextData>({
	currentUser: null,
	logIn,
	signUp,
	logOut,
	googleSignIn
});

export const UserAuthProvider: React.FC<IuserAuthProviderProps> = ({
	children
}) => {
	const [currentUser, setCurrentUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log(user);
				setCurrentUser(user);
			}

			return () => {
				unsubscribe();
			};
		});
	}, []);

	const value: AuthContextData = {
		currentUser,
		logIn,
		signUp,
		logOut,
		googleSignIn
	};

	return (
		<UserAuthContext.Provider value={value}>
			{children}
		</UserAuthContext.Provider>
	);
};

export const useUserAuth = () => {
	return useContext(UserAuthContext);
};
