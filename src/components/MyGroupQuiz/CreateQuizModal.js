import { useEffect, useRef, useState } from "react";
import Loader from "../Loader/Loader";
import axios from "../../axios/axios";
import { IoCloseOutline } from "react-icons/io5";
import "./EditQuizModal.css";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

const CreateQuizModal = ({ setShowCreateQuiz, groups }) => {
  const { apidata, userDetails, setShowCreateModal } = "props";
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDesc, setQuizDesc] = useState("");
  const [quizDuration, setQuizDuration] = useState("");
  const [quizGroupId, setQuizGroupId] = useState("test");
  const [startdate, setStartdate] = useState("");
  const [enddate, setEnddate] = useState("");
  const [quizInstructions, setQuizInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const refreshPage = () => {
    window.location.reload();
  };
  const editQuiz = async () => {
    if (!quizTitle || !quizDesc || !quizDuration || !startdate || !enddate)
      return alert("Please fill all the fields!");
    try {
      const postData = {
        title: quizTitle,
        creator: userDetails.user_id,
        desc: quizDesc,
        duration: quizDuration,
        Quizgroup: quizGroupId,
        //added quiz instruction
        instructions: quizInstructions,
        starttime: startdate + ":00+05:30",
        endtime: enddate + ":00+05:30",
      };
      console.log(postData);
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      setLoading(true);
      await axios.post("/api/create-quiz", postData, config);
      refreshPage();
      // fetchAllQuizzes();
      setShowCreateModal(false);
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  };

  //changeQuizDesc method handles changes in description using data.getData() method from editor
  const changeQuizDesc = (e, editor) => {
    const data = editor.getData();
    // console.log(data);
    setQuizDesc(data);
  };

  //changeQuizInstruction method handles changes in description using data.getData() method from editor
  const changeQuizInstruction = (e, editor) => {
    const Instructiondata = editor.getData();

    setQuizInstructions(Instructiondata);
  };

  useEffect(() => {
    const handler = (e) => {
      if (!modalRef.current?.contains(e.target)) {
        setShowCreateQuiz(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  });
  const clickHandler = (elem) => {
    console.log(elem.target.value);
  };
  return (
    <div className="edit-quiz-modal">
      <div className="edit-quiz-modal-card" ref={modalRef}>
        <h1>Create Quiz</h1>
        <button onClick={() => setShowCreateQuiz(false)} className="close-btn">
          <IoCloseOutline />
        </button>
        <div className="edit-quiz-form">
          <br />
          <label>Name</label>
          <input
            type="text"
            placeholder="Title..."
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
          />
          <br />
          <label>Quiz Group</label>
          <select
            name="Group Names"
            onChange={(e) => setQuizGroupId(e.target.value)}
          >
            <option>Select from below</option>
            {groups?.map((elem) => (
              <option value={elem.id}>{elem.name}</option>
            ))}
          </select>
          <br />
          <label>Description</label>
          <CKEditor
            editor={ClassicEditor}
            data={quizDesc}
            onChange={changeQuizDesc}
          />
          <br />
          <label>Duration (format: hh:mm:ss)</label>
          <input
            type="text"
            placeholder="Duration..."
            value={quizDuration}
            onChange={(e) => setQuizDuration(e.target.value)}
          />
          <br />
          <label>Start Date</label>
          <input
            type="datetime-local"
            value={startdate}
            onChange={(e) => setStartdate(e.target.value)}
          />
          <br />
          <label>End Date</label>
          <input
            type="datetime-local"
            value={enddate}
            onChange={(e) => setEnddate(e.target.value)}
          />
          <br />
          <label>Instructions</label>
          <CKEditor
            editor={ClassicEditor}
            data={quizInstructions}
            onChange={changeQuizInstruction}
          />
          <br />
          <button className="submit-btn" onClick={editQuiz}>
            Submit
          </button>
        </div>
      </div>
      {loading && (
        <div className="quiz--loader">
          <Loader />
        </div>
      )}
    </div>
  );
};

export default CreateQuizModal;
