import { useEffect, useRef } from "react";
import CloseOutlinedIcon from "@material-ui/icons/CloseOutlined";
import "./NavBar.css";
// import axios from "../../axios/axios";
import Loader from "../Loader/Loader";
import SingleNotification from "./SingleNotification";

const Notification = ({ setShowNotification, notifications, loading }) => {
  const notificationRef = useRef();

  useEffect(() => {
    const handler = (e) => {
      if (!notificationRef?.current?.contains(e.target)) {
        setShowNotification(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  });

  return (
    <div className="user-notification" ref={notificationRef}>
      <div className="notification-header">
        <h4>Notifications</h4>
        <button onClick={() => setShowNotification(false)}>
          <CloseOutlinedIcon />
        </button>
      </div>
      <div className="notification-body">
        {loading ? (
          <div className="notification-loader">
            <Loader />
          </div>
        ) : (
          notifications?.map((notification, idx) => (
            <SingleNotification
              key={idx}
              id={notification?.id}
              time={notification?.time}
              message={notification?.message}
              title={notification?.title}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Notification;
