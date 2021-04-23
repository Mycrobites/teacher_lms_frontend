import React, { useContext } from 'react';
import MyCourse from '../../components/MyCourse/MyCourse';
import SideBar from '../../components/SideBar/SideBar';
import UserContext from '../../context/authContext';
import './CoursePage.css';

const CoursePage = () => {
	const { userDetails } = useContext(UserContext);

	return (
		<div className="course-page">
			<SideBar active={'course'} />
			<div className="my-courses">
				<MyCourse user={userDetails} />
			</div>
		</div>
	);
};

export default CoursePage;
