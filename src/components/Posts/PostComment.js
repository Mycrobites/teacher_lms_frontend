import { useState, useEffect, useContext } from "react";
import UserContext from "../../context/authContext";
import axios from "../../axios/axios";
import { Avatar } from "@material-ui/core";
import { IoWarningOutline } from "react-icons/io5";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getCookie } from "./getCookie";

const PostComment = ({ setShowPostComment, postid, uid, setTotalAnswers }) => {
  const [comment, setComment] = useState("");
  const [isError, setIsError] = useState(false);
  const csrftoken = getCookie("csrftoken");
  const { userDetails } = useContext(UserContext);

  const postComment = async () => {
    try {
      if (comment) {
        const newComment = {
          text: comment,
          userid: uid,
          postid: postid,
        };
        const config = {
          headers: { Authorization: `Bearer ${userDetails.access}` },
        };
        const { data } = await axios.post(
          "/api/forum/createComments",
          newComment,
          config
        );
        setShowPostComment(false);
        if (data) {
          setTotalAnswers((prevTotal) => prevTotal + 1);
        }
      } else {
        setIsError(true);
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const error = setTimeout(() => {
      setIsError(false);
    }, 3000);
    return () => clearTimeout(error, 3000);
  }, [isError]);

  return (
    <div className="post-comment">
      <div className="user-profile">
        <Avatar />
      </div>
      <div className="post-comment-body">
        <form className="post-comment-form">
          <CKEditor
            editor={ClassicEditor}
            data={comment}
            config={{
              ckfinder: {
                uploadUrl:
                  "https://lab.progressiveminds.in/api/uploadimages?command=QuickUpload&type=Images&responseType=json",
                options: {
                  resourceType: "Images",
                },
                credentials: "include",
                headers: {
                  "X-CSRF-TOKEN": csrftoken,
                  csrftoken: csrftoken,
                  csrfmiddlewaretoken: csrftoken,
                },
              },
            }}
            onChange={(event, editor) => {
              const data = editor.getData();
              setComment(data);
            }}
          />
        </form>
        {isError && (
          <div className="error">
            <IoWarningOutline />
            <h3>All fields must be filled</h3>
          </div>
        )}
        <div className="post-comment-buttons">
          <button onClick={() => setShowPostComment(false)}>Cancel</button>
          <button onClick={postComment}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default PostComment;
