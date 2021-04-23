import React, { useContext } from 'react';
import MyQuiz from '../../components/MyQuiz/MyQuiz';
import SideBar from '../../components/SideBar/SideBar';
import UserContext from '../../context/authContext';

import './QuizPage.css';

const QuizPage = () => {
	const { userDetails } = useContext(UserContext);

	return (
		<div className="quiz-page">
			<SideBar active={'quiz'} />
			<div>
				<MyQuiz user={userDetails} />
			</div>
		</div>
	);
};

export default QuizPage;
