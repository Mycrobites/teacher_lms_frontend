import { createContext, useState } from "react";

const UserContext = createContext();

const getUserDetails = () => {
  const user = localStorage.getItem("user-details");
  if (user) {
    return JSON.parse(user);
  } else {
    return null;
  }
};

const getUserProfilePic = () => {
  const pic = localStorage.getItem("user-profile-pic");
  if (pic) {
    return JSON.parse(pic);
  } else {
    return null;
  }
};

export const UserContextProvider = (props) => {
  const [userDetails, setUserDetails] = useState(getUserDetails);
  const [userProfilePic, setUserProfilePic] = useState(getUserProfilePic);

  const updateUser = (data) => {
    setUserDetails(data);
    localStorage.setItem("user-details", JSON.stringify(data));
  };

  const removeUser = () => {
    setUserDetails(null);
    sessionStorage.clear();
    localStorage.clear();
  };

  const updateUserProfilePic = (pic) => {
    setUserProfilePic(pic);
    localStorage.setItem("user-profile-pic", JSON.stringify({ profile: pic }));
  };

  return (
    <UserContext.Provider
      value={{
        userDetails,
        updateUser,
        removeUser,
        userProfilePic,
        updateUserProfilePic,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export default UserContext;
