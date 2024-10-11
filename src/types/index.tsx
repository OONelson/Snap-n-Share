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
	username: string | number;
}
