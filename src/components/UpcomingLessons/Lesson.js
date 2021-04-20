import { months } from "../../assets/months/months";

const Lesson = ({ timeStamp, topic, link }) => {
  const date = new Date(timeStamp);

  return (
    <div className="single-lesson">
      <div className="time">
        <h2>
          {months[date.getMonth()]} {date.getDate()}
        </h2>
        <p>
          {date.getHours() % 12 < 10
            ? `0${date.getHours() % 12}`
            : date.getHours() % 12}
          :
          {date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}
          {date.getHours() < 12 ? " AM" : " PM"}
        </p>
      </div>
      <div className="title">
        <h2>{topic}</h2>
      </div>
      <div className="meeting-link">
        <a href={link} target="_blank" rel="noreferrer">
          Join here
        </a>
      </div>
    </div>
  );
};

export default Lesson;
