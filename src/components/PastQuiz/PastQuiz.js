import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Loader from '../Loader/Loader';
import axios from '../../axios/axios';
import months from '../../assets/months/months';
import './PastQuiz.css';

const getDateString = (now) => {
	const a = now.split(' ')[0].split('/');
	const b = now.split(' ')[1];
	return `${a[0]} ${
		a[1] < 10 ? months[a[1].split('')[1] - 1] : months[a[1] - 1]
	} ${a[2]} ${b}`;
};

const getDuration = (duration) => {
	const dur = duration.split(':');
	const hour = dur[0] !== '00' ? `${dur[0]} hours ` : '';
	const min = dur[1] !== '00' ? `${dur[1]} mins ` : '';
	const sec = dur[2] !== '00' ? `${dur[2]} secs` : '';
	return `${hour}${min}${sec}`;
};

const getPastQuizFromLocalStorage = () => {
	const data = localStorage.getItem('past-quiz');
	if (data) {
		return JSON.parse(data);
	} else {
		return null;
	}
};

const PastQuiz = ({ user }) => {
	const [pastQuizzes, setPastQuizzes] = useState(getPastQuizFromLocalStorage);

	const history = useHistory();
	useEffect(() => {
		let isUnmounted = false;
		const fetchPastQuizzes = async () => {
			try {
				const config = {
					headers: { Authorization: `Bearer ${user.access}` },
				};
				const { data } = await axios.get(
					`/teacher/quiz/getQuiz/${user.username}`,
					config,
				);
				if (!isUnmounted) {
					setPastQuizzes(data.response);
					localStorage.setItem('past-quiz', JSON.stringify(data.response));
				}
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchPastQuizzes();
		return () => {
			isUnmounted = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="past-quiz">
			<h2 className="past-quiz-title">Past Quiz</h2>
			{!pastQuizzes && <Loader />}
			<div className="past-quiz-cards">
				{pastQuizzes?.map((quiz) => (
					<div
						key={quiz.id}
						onClick={() => history.push(`/quizquestions/${quiz.id}`)}
						className="single-past-quiz"
						style={{ cursor: 'pointer' }}
					>
						<h2>{quiz.quiz_title}</h2>
						<p>Duration: {getDuration(quiz.duration)}</p>
						<p>Starts on {getDateString(quiz.start_date)}</p>
						<p>Ends on {getDateString(quiz.expire_date)}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default PastQuiz;
