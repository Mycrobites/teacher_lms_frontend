import React from 'react';
import SideBar from '../../components/SideBar/SideBar';
import './CoursePage.css';

const CoursePage = () => {
	return (
		<div className="course-page">
			<SideBar active={'course'} />
			This is CoursePage
		</div>
	);
};

export default CoursePage;
