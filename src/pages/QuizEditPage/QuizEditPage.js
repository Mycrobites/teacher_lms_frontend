import React from 'react';
import { useParams } from 'react-router-dom';
import './QuizEditPage.css';

const QuizEditPage = () => {
	const { id } = useParams();
	return <div>This is quiz edit page {id}</div>;
};

export default QuizEditPage;
