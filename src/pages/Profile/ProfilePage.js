import React from "react";
import SideBar from "../../components/SideBar/SideBar";
import Profile from "../../components/ProfileComponent/Profile";


const ProfilePage = () => {
  return (
    <div className="profile-page">

      <SideBar active={""} />
      <Profile />
    </div>
  );
};

export default ProfilePage;
