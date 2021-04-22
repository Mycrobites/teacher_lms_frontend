import { useState, useEffect, useContext } from 'react';
import Loader from '../Loader/Loader';
import SingleReply from './SingleReply';
import axios from '../../axios/axios';
import './CommentReply.css';
import UserContext from '../../context/authContext';

const CommentReplies = ({ id, uid, setTotalReplies }) => {
	const [replies, setReplies] = useState(null);
	const [showReplyInput, setShowReplyInput] = useState(false);
	const [replyText, setReplyText] = useState('');
	const { userDetails } = useContext(UserContext);

	const replyComment = async () => {
		if (!replyText) {
			alert('empty');
			return;
		}
		try {
			const reply = {
				text: replyText,
				userid: uid,
				postid: null,
				parent: id,
			};
			const config = {
				headers: { Authorization: `Bearer ${userDetails.access}` },
			};
			const { data } = await axios.post(
				'/api/forum/createComments',
				reply,
				config,
			);
			// console.log(data);
			setReplies([...replies, data.comment]);
			setTotalReplies((prevCount) => prevCount + 1);
			setReplyText('');
			setShowReplyInput(false);
		} catch (err) {
			console.log(err);
		}
	};

	useEffect(() => {
		let isUnmounted = false;
		const fetchReplies = async () => {
			try {
				const config = {
					headers: { Authorization: `Bearer ${userDetails.access}` },
				};
				const { data } = await axios.get(
					`/api/forum/getComments/${id}`,
					config,
				);
				if (!isUnmounted) {
					setReplies(data.comments);
				}
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchReplies();
		return () => {
			isUnmounted = true;
		};
	}, [id]);

	return (
		<div className="comment-reply">
			{!replies ? (
				<Loader />
			) : (
				<>
					<button
						onClick={() => setShowReplyInput(!showReplyInput)}
						className="reply-button"
					>
						Reply
					</button>
					{showReplyInput && (
						<div className="reply-form">
							<textarea
								placeholder="Reply..."
								value={replyText}
								onChange={(e) => setReplyText(e.target.value)}
							/>
							<div className="reply-form-buttons">
								<button onClick={() => setShowReplyInput(false)}>Cancel</button>
								<button onClick={replyComment}>Reply</button>
							</div>
						</div>
					)}
					{replies?.length === 0 && (
						<p className="no-answers">No replies to display...</p>
					)}

					{replies?.map((reply) => (
						<SingleReply
							key={reply.id}
							{...reply}
							uid={uid}
							replies={replies}
							setReplies={setReplies}
						/>
					))}
				</>
			)}
		</div>
	);
};

export default CommentReplies;
