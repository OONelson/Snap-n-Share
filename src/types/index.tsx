import { OutputFileEntry } from "@uploadcare/react-uploader";
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

export interface FileEntry {
  files: OutputFileEntry[];
}

export interface Post {
  caption: string;
  photos: PhotoMeta[];
  likes: number;
  userlikes: [];
  userId: string | null;
  date: Date;
}

export interface PhotoMeta {
  cdnUrl: string;
  uuid: string;
}

export interface ProfileInfo {
  user?: User;
  displayName?: string;
  photoURL?: string;
}

export interface UserProfileInfo {
  user: User;
  email: string;
  uid?: string;
  bio?: string;
  username?: string;
  displayName?: string;
  photoURL?: string;
}

export interface ProfileResponse {
  id?: string;
  bio?: string;
  username?: string;
  displayName: string;
  photoURL?: string;
  userEmail?: string;
}

export interface DocumentResponse {
  id: string;
  caption?: string;
  photos: PhotoMeta[];
  likes?: number;
  userlikes: [];
  userbookmarks: [];
  userId?: string | null;
  date?: Date;
}

export interface Bookmark {
  postId: string;
  userId: string;
}
