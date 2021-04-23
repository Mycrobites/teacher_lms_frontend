import React from 'react';
import { useParams } from 'react-router-dom';
import './CourseEditPage.css';

const CourseEditPage = () => {
	const { id } = useParams();
	return <div>This is course-edit-page {id}</div>;
};

export default CourseEditPage;
