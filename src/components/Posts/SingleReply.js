import { useState, useEffect, useRef, useContext } from 'react';
import ReportModal from './ReportModal';
import months from '../../assets/months/months';
import axios from '../../axios/axios';
import { Avatar } from '@material-ui/core';
import { AiFillCaretUp } from 'react-icons/ai';
import { MdReportProblem } from 'react-icons/md';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { MdEdit, MdDelete } from 'react-icons/md';
import UserContext from '../../context/authContext';

const SingleReply = (props) => {
	const {
		id,
		user_profile_pic,
		time,
		user,
		text,
		upvote,
		userid,
		uid,
		replies,
		setReplies,
	} = props;
	const [showEditDelete, setShowEditDelete] = useState(false);
	const [showReportModal, setShowReportModal] = useState(false);
	const [reportModalText, setReportModalText] = useState(false);
	const [isEditingReply, setIsEditingReply] = useState(false);
	const [editedReply, setEditedReply] = useState(text);
	const { userDetails } = useContext(UserContext);

	const editDeleteRef = useRef(null);
	const now = new Date(time);

	const reportReply = async () => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${userDetails.access}` },
			};
			const response = await axios.post(
				'/api/forum/reportComment',
				{
					user: uid,
					comment: id,
				},
				config,
			);
			//   console.log(response.data);
			if (response.status === 200) {
				setShowReportModal(true);
				if (response.data.message) {
					setReportModalText(response.data.message);
				} else {
					setReportModalText('You reported this post');
				}
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	const deleteReply = async () => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${userDetails.access}` },
			};
			await axios.delete(`/api/forum/editComment/${id}`, config);
			setReplies(replies.filter((reply) => reply.id !== id));
		} catch (err) {
			console.log(err.message);
		}
	};

	const upvoteReply = async () => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${userDetails.access}` },
			};
			const { data } = await axios.patch(
				`/api/forum/upvote/${id}/${userDetails.username}`,
				config,
			);
			// console.log(data);
			if (data.upvote.length === 1) {
				setReplies(
					replies.map((reply) => {
						if (reply.id === id) {
							return { ...reply, upvote: reply.upvote + 1 };
						} else return reply;
					}),
				);
			} else if (data.upvote.length === 0) {
				setReplies(
					replies.map((reply) => {
						if (reply.id === id) {
							return { ...reply, upvote: reply.upvote - 1 };
						} else return reply;
					}),
				);
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	const editReply = async () => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${userDetails.access}` },
			};
			const { data } = await axios.put(
				`/api/forum/editComment/${id}`,
				{
					text: editedReply,
					userid: uid,
					postid: null,
				},
				config,
			);
			setIsEditingReply(false);
			//   console.log(data);
			setReplies(
				replies.map((comment) => {
					if (comment.id === id) return { ...comment, text: data.text };
					else return comment;
				}),
			);
		} catch (err) {
			console.log(err.message);
			setReplies(null);
		}
	};

	useEffect(() => {
		const handler = (e) => {
			if (!editDeleteRef?.current?.contains(e.target)) {
				setShowEditDelete(false);
			}
		};
		document.addEventListener('click', handler);
		return () => document.removeEventListener('click', handler);
	});

	return (
		<div key={id} className="reply">
			<div className="reply-user">
				<Avatar src={user_profile_pic} />
			</div>
			<div className="reply-content">
				<div className="comment-time">
					<h3 className="time">
						Replied on {now.getDate()} {months[now.getMonth()]}{' '}
						{now.getFullYear()} {time.split(' ')[1]}
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
							<button id="edit-btn" onClick={() => setIsEditingReply(true)}>
								<MdEdit /> Edit
							</button>
							<button id="delete-btn" onClick={deleteReply}>
								<MdDelete /> Delete
							</button>
						</div>
					)}
				</div>
				<h2 className="reply-user">{user}</h2>
				{/* <p className="reply-text">{text}</p> */}
				{!isEditingReply ? (
					<p className="reply-text">{text}</p>
				) : (
					<div className="edit-comment-div">
						<textarea
							placeholder="Edit reply..."
							value={editedReply}
							onChange={(e) => setEditedReply(e.target.value)}
						/>
						<div className="edit-div">
							<button onClick={() => setIsEditingReply(false)}>Cancel</button>
							<button onClick={editReply}>Done</button>
						</div>
					</div>
				)}
				<div className="comment-upvotes">
					<button onClick={upvoteReply}>
						<AiFillCaretUp /> Upvotes ({upvote})
					</button>
					<button onClick={reportReply} className="report-button">
						<MdReportProblem /> Report
					</button>
				</div>
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

export default SingleReply;
