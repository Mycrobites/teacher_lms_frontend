import { useEffect, useRef ,useContext } from "react";
import { Link } from "react-router-dom";
import AccountCircleOutlinedIcon from "@material-ui/icons/AccountCircleOutlined";
// import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PowerSettingsNewOutlinedIcon from "@material-ui/icons/PowerSettingsNewOutlined";
import "./NavBar.css";
import UserContext from "../../context/authContext";

const UserDetail = ({ name, setShowUser }) => {
  const userDetailRef = useRef(null);
  const {removeUser} = useContext(UserContext)

  const logOut = ()=>{
    setShowUser(false)
    removeUser()
  }

  useEffect(() => {
    const handler = (e) => {
      if (!userDetailRef?.current?.contains(e.target)) {
        setShowUser(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  });

  return (
    <div className="user-detail" ref={userDetailRef}>
      <div className="user-login">
        <p>Signed in as</p>
        <h6>{name}</h6>
      </div>
      <div className="profile-options">
        <Link to="/profile" onClick={() => setShowUser(false)}>
          <AccountCircleOutlinedIcon />
          Your profile
        </Link>
        {/* <Link to="#" onClick={() => setShowUser(false)}>
          <SettingsOutlinedIcon />
          Settings
        </Link> */}
        <Link to="#" onClick={logOut}>
          <PowerSettingsNewOutlinedIcon />
          Sign out
        </Link>
      </div>
    </div>
  );
};

export default UserDetail;
