const SingleNotification = ({ id, time, title, message }) => {
  const millisecond = Date.parse(time);
  const date = new Date(millisecond);

  return (
    <div className="single-notification">
      <div>
        <h3>{title}</h3>
        <p>{message}</p>
      </div>
      <div className="notification-time">
        <h3>
          {date.toDateString().split(" ")[1]}{" "}
          {date.toDateString().split(" ")[2]}
        </h3>
        <p>
          {date.toString().split(" ")[4].split(":")[0]}:
          {date.toString().split(" ")[4].split(":")[1]}
        </p>
      </div>
    </div>
  );
};

export default SingleNotification;
