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
import { auth, db } from "../firebase/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";

interface IuserAuthProviderProps {
	children: React.ReactNode;
}

type AuthContextData = {
	user: User | null;
	logIn: typeof logIn;
	signUp: typeof signUp;
	logOut: typeof logOut;
	googleSignIn: typeof googleSignIn;
};

const logIn = (email: string, password: string) => {
	signInWithEmailAndPassword(auth, email, password);
};

const signUp = async (email: string, password: string) => {
	createUserWithEmailAndPassword(auth, email, password);
	const user = auth.currentUser;
	console.log(user);  
	if(user){
		await setDoc(doc(db, "users", user.uid),{
			email: user.email,
		})
	}
};

const logOut = () => {
	signOut(auth);
};

const googleSignIn = () => {
	const googleAuthProvider = new GoogleAuthProvider();
	signInWithPopup(auth, googleAuthProvider);
};

export const UserAuthContext = createContext<AuthContextData>({
	user: null,
	logIn,
	signUp,
	logOut,
	googleSignIn
});

export const UserAuthProvider: React.FC<IuserAuthProviderProps> = ({
	children
}) => {
	const [user, setUser] = useState<User | null>(null);

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			if (user) {
				console.log(user);
				setUser(user);
			}

			return () => {
				unsubscribe();
			};
		});
	}, []);

	const value: AuthContextData = {
		user,
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
