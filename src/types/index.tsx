import { User } from "firebase/auth";

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
  username: string;
}

export interface Post {
  id?: string;
  caption: string;
  photos: string;
  likes: number;
  likedBy: string[];
  userbookmarks?: string[];
  displayName?: string;
  username: string;
  userId: string;
  createdAt: string | Date;
}

// export interface ProfileInfo {
//   user?: User;
//   displayName?: string;
//   photoURL?: string;
// }

export interface UserProfileInfo {
  user: Partial<User>;
  email: string;
  uid: string;
  bio?: string;
  username: string;
  displayName: string;
  photoURL?: string;
  // followers?: number;
  // following?: number;
}

export interface ProfileResponse {
  id: string;
  bio?: string;
  username?: string;
  displayName?: string;
  photoURL?: string;
  userEmail?: string;
}

export interface DocumentResponse {
  id: string;
  caption?: string;
  photos: string;
  likes?: number;
  likedBy: string[];
  userbookmarks?: string[];
  username: string;
  displayName?: string;
  userId: string;
  createdAt: string | Date;
}

export interface Bookmark {
  postId: string;
  userId: string;
}

export interface CommentResponse {
  id?: string;
  postId: string;
  author?: string;
  text: string;
  authorUserId: string;
  likes: number;
  likedBy: string[];
  createdAt: string | Date;
}

export interface Comment {
  postId: string;
  author?: string;
  text: string;
  authorUserId: string;
  likes: number;
  likedBy: string[];
  createdAt: string | Date;
}
