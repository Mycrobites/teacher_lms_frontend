import React, { useContext, useState } from "react";
import "./CreateGroup.css";
import Loader from "../Loader/Loader";
import { IoCloseOutline } from "react-icons/io5";
import axios from "../../axios/axios";
// import UserContext from '../../context/authContext';

const getCourseListFromLocalStorage = () => {
  const lessons = localStorage.getItem("courses");
  if (lessons) {
    const courses = JSON.parse(lessons);
    return courses;
  } else {
    return null;
  }
};

const CreateGroupQuizModal = (props) => {
  const { apidata, userDetails, setShowCreateGroupModal, fetchquizzes } = props;
  const courseList = getCourseListFromLocalStorage();
  const [checkedItems, setCheckedItems] = useState(new Map());
  const [grouptitle, setGroupTitle] = useState("");
  const [groupdescription, setGroupDescription] = useState("");
  const [loading, setloading] = useState(false);
  const [message, setmessage] = useState("");
  const [error, setError] = useState(false);
  const [data, setdata] = useState();
  console.log("user", userDetails);
  let groups = [];
  const handleCheckbox = (e, id) => {
    let isChecked = e.target.checked;
    let item = e.target.value;
    console.log(isChecked, item);
    if (isChecked === true) {
      console.log(1);
      groups.push(id);
    } else {
      groups.pop(id);
    }
    console.log(groups);
    setCheckedItems(checkedItems.set(item, isChecked));
  };

  const refreshPage = () => {
    window.location.reload();
  };

  const createGroup = async () => {
    setloading(true);
    if (!grouptitle || !groupdescription) {
      setmessage("Fill all the details.");
      return;
    }

    if (groups.length === 0) {
      setmessage("Select atleast 1 course.");
      return;
    }

    try {
      const postData = {
        title: grouptitle,
        description: groupdescription,
        course: groups,
      };

      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };

      const data = await axios.post(`/api/create-group`, postData, config);

      if (data) {
        setloading(false);
      }

      setmessage("New Group created successfully");
      setGroupTitle("");
      setGroupDescription("");
      setdata(data);
      setError(false);
      setloading(false);
      setShowCreateGroupModal(false);
      // refreshPage();
      console.log(data);
    } catch (err) {
      console.log(err.message);
    }

    setShowCreateGroupModal(false);
    console.log("API Request Send");
    console.log(groups);
    console.log(grouptitle, groupdescription);
  };

  return (
    <div className="edit-quiz-modal">
      <div className="edit-quiz-modal-card">
        <h2>Create Group</h2>
        <button
          onClick={() => setShowCreateGroupModal(false)}
          className="close-btn"
        >
          <IoCloseOutline />
        </button>

        <div className="quiz-modal-title">
          <label className="modal-label">Enter Quiz Group Title</label>
          <input
            type="text"
            className="modal-input"
            onChange={(e) => setGroupTitle(e.target.value)}
            value={grouptitle}
          />
        </div>
        <div className="quiz-modal-des">
          <label className="modal-label">Enter Quiz Group Description</label>
          <input
            type="text"
            className="modal-input"
            onChange={(e) => setGroupDescription(e.target.value)}
            value={groupdescription}
          />
        </div>

        <div className="quiz-modal-des">
          <label className="modal-label">Select Courses</label>
          <ul>
            {courseList.map((course) => (
              <li key={course.id}>
                <label>
                  <input
                    type="checkbox"
                    value={course.course_name}
                    onChange={() => handleCheckbox(course.id)}
                  />{" "}
                  {course.course_name}{" "}
                </label>
              </li>
            ))}
          </ul>
        </div>

        {message && (
          <div className="quiz-group-message">
            <p
              className="quiz-group-message-message"
              style={{
                background: error ? "#ffb3b3" : "#d4e7f7",
                marginTop: "20px",
              }}
            >
              {message}
            </p>
          </div>
        )}
        <button className="create-group-button" onClick={createGroup}>
          Create Quiz Group
        </button>
      </div>
    </div>
  );
};

export default CreateGroupQuizModal;
