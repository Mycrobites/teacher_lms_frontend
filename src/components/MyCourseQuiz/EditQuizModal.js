import { useEffect, useRef, useState } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import Loader from '../Loader/Loader';
import axios from '../../axios/axios';
import './EditQuizModal.css';

const getCorrectDateFormat = (d) => {
	const date = d.split(' ')[0].split('/');
	const time = d.split(' ')[1];
	return `${date[2]}-${date[1]}-${date[0]}T${time}`;
};

const ScheduleClass = ({
	setEditQuiz,
	quizTitle,
	duration,
	startDate,
	expireDate,
	user,
	id,
	description,
	getCourses,
}) => {
	const [quizName, setQuizName] = useState(quizTitle);
	const [quizDuration, setQuizDuration] = useState(duration);
	const [quizDescription, setQuizDescription] = useState(description);
	const [startdate, setStartdate] = useState(() =>
		getCorrectDateFormat(startDate),
	);
	const [expiredate, setExpireDate] = useState(() =>
		getCorrectDateFormat(expireDate),
	);
	const [loading, setLoading] = useState(false);
	const modalRef = useRef(null);

	const editQuiz = async () => {
		if (!quizName || !quizDuration || !startdate || !expiredate)
			return alert('Please fill all the fields!');
		try {
			const postData = {
				quiz_name: quizName,
				duration: quizDuration,
				description: quizDescription,
				start_date: startdate + '+05:30',
				expire_date: expiredate + '+05:30',
			};

			const config = {
				headers: { Authorization: `Bearer ${user.access}` },
			};
			setLoading(true);
			await axios.patch(`/teacher/quiz/editQuiz/${id}`, postData, config);

			getCourses();
			setLoading(false);
			setEditQuiz(false);
		} catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		const handler = (e) => {
			if (!modalRef.current?.contains(e.target)) {
				setEditQuiz(false);
			}
		};
		window.addEventListener('click', handler);
		return () => window.removeEventListener('click', handler);
	});

	return (
		<div className="edit-quiz-modal">
			<div className="edit-quiz-modal-card" ref={modalRef}>
				<h1>Edit Quiz</h1>
				<button onClick={() => setEditQuiz(false)} className="close-btn">
					<IoCloseOutline />
				</button>
				<div className="edit-quiz-form">
					<br />
					<label>Name</label>
					<input
						type="text"
						placeholder="Name..."
						value={quizName}
						onChange={(e) => setQuizName(e.target.value)}
					/>
					<br />
					<label>
						<p>Enter Description</p>
						<textarea
							style={{ width: '100%', height: '70px', padding: '10px' }}
							name="quiz_desc"
							value={quizDescription}
							onChange={(e) => setQuizDescription(e.target.value)}
							placeholder="Add Description..."
						/>
					</label>
					<br />
					<label>Duration (format: hh:mm:ss)</label>
					<input
						type="text"
						placeholder="Duration..."
						value={quizDuration}
						onChange={(e) => setQuizDuration(e.target.value)}
					/>
					<br />
					<label>Expire Date</label>
					<input
						type="datetime-local"
						value={startdate}
						onChange={(e) => setStartdate(e.target.value)}
					/>
					<br />
					<label>Start Date</label>
					<input
						type="datetime-local"
						value={expiredate}
						onChange={(e) => setExpireDate(e.target.value)}
					/>
					<br />
					<button className="submit-btn" onClick={editQuiz}>
						Submit
					</button>
				</div>
			</div>
			{loading && (
				<div className="quiz-loader">
					<Loader />
				</div>
			)}
		</div>
	);
};

export default ScheduleClass;
