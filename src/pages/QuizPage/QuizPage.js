import React from 'react';
import SideBar from '../../components/SideBar/SideBar';

import './QuizPage.css';

const QuizPage = () => {
	return (
		<div className="quiz-page">
			<SideBar active={'quiz'} />
			This is quizpage
		</div>
	);
};

export default QuizPage;
