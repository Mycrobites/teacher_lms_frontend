import { useState, useEffect, useRef, useContext } from "react";
import UserContext from "../../context/authContext";
import ReportModal from "./ReportModal";
import CommentReplies from "./CommentReplies";
import axios from "../../axios/axios";
import months from "../../assets/months/months";
import { Avatar } from "@material-ui/core";
import { AiFillCaretUp } from "react-icons/ai";
import { MdReportProblem } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import { MdEdit, MdDelete } from "react-icons/md";
import { GoReply } from "react-icons/go";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { getCookie } from "./getCookie";
import parse from "html-react-parser";

const Comment = (props) => {
  const {
    id,
    user,
    userid,
    user_profile_pic,
    upvote,
    text,
    time,
    comments,
    setComments,
    uid,
    totalreplies,
  } = props;
  const [showEditDelete, setShowEditDelete] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportModalText, setReportModalText] = useState(null);
  const [isEditingComment, setIsEditingComment] = useState(false);
  const [editedComment, setEditedComment] = useState(text);
  const [showCommentReplies, setShowCommentReplies] = useState(false);
  const [totalReplies, setTotalReplies] = useState(totalreplies);
  const editDeleteRef = useRef(null);
  const now = new Date(time);
  const { userDetails } = useContext(UserContext);
  const csrftoken = getCookie("csrftoken");

  const reportComment = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const response = await axios.post(
        "/api/forum/reportComment",
        {
          user: uid,
          comment: id,
        },
        config
      );
      if (response.status === 200) {
        setShowReportModal(true);
        if (response.data.message) {
          setReportModalText(response.data.message);
        } else {
          setReportModalText("You reported this post");
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const upvoteComment = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const { data } = await axios.patch(
        `/api/forum/upvote/${id}/${userDetails.username}`,
        config
      );
      if (data.upvote.length === 1) {
        setComments(
          comments.map((reply) => {
            if (reply.id === id) {
              return { ...reply, upvote: reply.upvote + 1 };
            } else return reply;
          })
        );
      } else if (data.upvote.length === 0) {
        setComments(
          comments.map((reply) => {
            if (reply.id === id) {
              return { ...reply, upvote: reply.upvote - 1 };
            } else return reply;
          })
        );
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteComment = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      await axios.delete(`/api/forum/editComment/${id}`, config);
      setComments(comments.filter((comment) => comment.id !== id));
    } catch (err) {
      console.log(err.message);
    }
  };

  const editComment = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userDetails.access}` },
      };
      const { data } = await axios.put(
        `/api/forum/editComment/${id}`,
        {
          text: editedComment,
          userid: uid,
          postid: null,
        },
        config
      );
      setIsEditingComment(false);
      setComments(
        comments.map((comment) => {
          if (comment.id === id) return { ...comment, text: data.text };
          else return comment;
        })
      );
    } catch (err) {
      console.log(err.message);
    }
  };

  useEffect(() => {
    const handler = (e) => {
      if (!editDeleteRef?.current?.contains(e.target)) {
        setShowEditDelete(false);
      }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  });

  return (
    <div className="comment">
      <div className="user-profile">
        <Avatar src={user_profile_pic} />
      </div>
      <div className="comment-content">
        <div className="comment-time">
          <h3 className="time">
            Posted on {now.getDate()} {months[now.getMonth()]}{" "}
            {now.getFullYear()} {time.split(" ")[1]}
          </h3>
          {userid === uid && (
            <button
              onClick={() => setShowEditDelete(!showEditDelete)}
              className="three-dots"
              ref={editDeleteRef}
            >
              <BsThreeDotsVertical />
            </button>
          )}
          {showEditDelete && (
            <div className="delete-edit-comment-div">
              <button id="edit-btn" onClick={() => setIsEditingComment(true)}>
                <MdEdit /> Edit
              </button>
              <button id="delete-btn" onClick={deleteComment}>
                <MdDelete /> Delete
              </button>
            </div>
          )}
        </div>
        <h2 className="username">{user}</h2>
        {!isEditingComment ? (
          <p className="comment-text">
            {text[0] === "<" ? parse(text) : text}
          </p>
        ) : (
          <div className="edit-comment-div">
            <CKEditor
              editor={ClassicEditor}
              data={editedComment}
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
                setEditedComment(data);
              }}
            />
            <div className="edit-div">
              <button onClick={() => setIsEditingComment(false)}>Cancel</button>
              <button onClick={editComment}>Done</button>
            </div>
          </div>
        )}
        <div className="comment-upvotes">
          <button onClick={upvoteComment}>
            <AiFillCaretUp /> Upvotes ({upvote})
          </button>
          <button onClick={reportComment}>
            <MdReportProblem /> Report
          </button>
          <button onClick={() => setShowCommentReplies(!showCommentReplies)}>
            <GoReply /> {totalReplies} Replies
          </button>
        </div>

        {showCommentReplies && (
          <CommentReplies uid={uid} id={id} setTotalReplies={setTotalReplies} />
        )}
      </div>

      {showReportModal && (
        <ReportModal
          reportModalText={reportModalText}
          setShowReportModal={setShowReportModal}
        />
      )}
    </div>
  );
};

export default Comment;
