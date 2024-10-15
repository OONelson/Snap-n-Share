import { User } from "firebase/auth";

type StringOrMixedArray = string[] | (string | number)[];

export interface UserLogIn {
	email: string;
	password: string;
}

export interface UserSignUp {
	email: string;
	password: string;
	confirmPassword: string;
}

export interface NewUserPassword {
	email: string;
}

export interface UserName {
	username: StringOrMixedArray;
}

export interface ProfileInfo {
	user?: User;
	displayName: string;
	profilephoto: string;
}
