import React, { useState, useEffect, useContext } from 'react';
import UserContext from '../../context/authContext';
import axios from '../../axios/axios';
import './MyQuiz.css';
import Loader from '../Loader/Loader';
import Carousel from 'react-elastic-carousel';
import SingleQuiz from './SingleQuiz';

const getQuizFromLocalStorage = () => {
	const quiz = localStorage.getItem('all-quiz');
	if (quiz) {
		return JSON.parse(quiz);
	} else {
		return null;
	}
};

const breakPoints = [
	{ width: 1, itemsToShow: 1 },
	{ width: 500, itemsToShow: 2 },
	{ width: 900, itemsToShow: 3 },
	{ width: 1100, itemsToShow: 4 },
];

const MyQuiz = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [quiz, setQuiz] = useState(getQuizFromLocalStorage);
	const { userDetails } = useContext(UserContext);

	useEffect(() => {
		let isUnmounted = false;
		const getCourses = async () => {
			try {
				if (!quiz) setLoading(true);
				const config = {
					headers: { Authorization: `Bearer ${userDetails.access}` },
				};
				const { data } = await axios.get(
					`/teacher/quiz/getQuiz/${user.username}`,
					config,
				);
				if (!isUnmounted) {
					setQuiz(data?.response);
					console.log(data.response);
					localStorage.setItem('all-quiz', JSON.stringify(data.response));
				}
			} catch (err) {
				console.log(err.message);
			}
			setLoading(false);
		};
		getCourses();
		console.log(quiz);

		return () => {
			isUnmounted = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	if (loading) {
		return (
			<div className="loading-div">
				<Loader />
			</div>
		);
	}

	return (
		<div className="my-quiz">
			<div style={{ marginBottom: '20px' }} className="title">
				<h1
					style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}
				>
					Welcome! {user.first_name}
				</h1>
				<h4 style={{ color: 'gray' }}>Here are All Your Quizzes</h4>
			</div>

			<div className="quiz-cards">
				<Carousel breakPoints={breakPoints}>
					{quiz?.map((quiz) => (
						<SingleQuiz key={quiz.id} {...quiz} />
					))}
				</Carousel>
			</div>
		</div>
	);
};

export default MyQuiz;
