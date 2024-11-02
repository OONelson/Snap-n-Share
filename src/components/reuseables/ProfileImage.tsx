import React from "react";

interface ProfileImageProps {
  email: string;
  profilePhotoURL?: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ email }) => {
  // Function to extract initials from email

  const getInitials = (email: string): string => {
    const name = email.split("@")[0];

    const nameParts = name.split(".");
    const initials = nameParts
      .map((part) => part.charAt(0).toUpperCase())
      .join("");
    return initials;
  };

  const initials = getInitials(email);

  return <div>{initials}</div>;
};

export default ProfileImage;
