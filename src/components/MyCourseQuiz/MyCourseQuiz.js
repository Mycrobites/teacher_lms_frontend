import React, { useState, useEffect } from 'react';
import axios from '../../axios/axios';
import Loader from '../Loader/Loader';
import Carousel from 'react-elastic-carousel';
import SingleQuiz from './SingleQuiz';
import './MyCourseQuiz.css';

const breakPoints = [
	{ width: 1, itemsToShow: 1 },
	{ width: 500, itemsToShow: 2 },
	{ width: 900, itemsToShow: 3 },
	{ width: 1100, itemsToShow: 4 },
];

const MyCourseQuiz = ({ user }) => {
	const [loading, setLoading] = useState(false);
	const [quiz, setQuiz] = useState(null);

	const getCoursesQuiz = async () => {
		try {
			if (!quiz) setLoading(true);
			const config = {
				headers: { Authorization: `Bearer ${user.access}` },
			};
			const { data } = await axios.get(
				`/teacher/quiz/getQuiz/${user.username}`,
				config,
			);

			setQuiz(data?.response);
		} catch (err) {
			console.log(err.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		getCoursesQuiz();
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
				<h4 style={{ color: 'gray' }}>Here are All Your Course Quizzes</h4>
			</div>

			{quiz?.length === 0 && (
				<p
					style={{
						textAlign: 'center',
						marginTop: 200,
						fontWeight: 600,
						color: 'rgba(0,0,0,0.5)',
					}}
				>
					You haven't created any quiz
				</p>
			)}

			{quiz?.length > 0 && (
				<div className="quiz-cards">
					<Carousel breakPoints={breakPoints}>
						{quiz?.map((quiz) => (
							<SingleQuiz
								key={quiz.id}
								{...quiz}
								user={user}
								getCoursesQuiz={getCoursesQuiz}
							/>
						))}
					</Carousel>
				</div>
			)}
		</div>
	);
};

export default MyCourseQuiz;
