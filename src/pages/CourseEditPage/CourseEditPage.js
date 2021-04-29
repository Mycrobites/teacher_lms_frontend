import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../../axios/axios';
import CourseContent from '../../components/CourseContent/CourseContent';
import EnrolledStudent from '../../components/EnrolledStudents/EnrolledStudent';
import Loader from '../../components/Loader/Loader';
import UserContext from '../../context/authContext';
import './CourseEditPage.css';

const CourseEditPage = () => {
	const { id } = useParams();

	const [enrolledStudents, setEnrolledStudents] = useState(null);
	const [lessonsData, setLessonsData] = useState(null);
	// const [loading, setLoading] = useState(true);
	const { userDetails } = useContext(UserContext);
	const fetchEnrolledStudent = async () => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${userDetails.access}` },
			};
			const { data } = await axios.get(
				`/teacher/getEnrolledStudents/${userDetails.username}/${id}`,
				config,
			);
			console.log(data);
			setEnrolledStudents(data.response);
			// setLoading(false);
		} catch (err) {
			console.log(err.message);
		}
	};

	const fetchLessonContent = async () => {
		// setLoading(true);
		try {
			const config = {
				headers: { Authorization: `Bearer ${userDetails.access}` },
			};
			const { data } = await axios.get(`/teacher/getCourse/${id}`, config);
			console.log(data.course_details);
			setLessonsData(data.course_details);
			// setLoading(false);
		} catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		fetchLessonContent();
		fetchEnrolledStudent();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<>
			{!lessonsData ? (
				<div className="profile-loader">
					<Loader />
				</div>
			) : (
				<div className="course-edit-page">
					<CourseContent
						lessons={lessonsData?.lessons}
						user={userDetails}
						id={id}
						fetchLessonContent={fetchLessonContent}
					/>
					<EnrolledStudent students={enrolledStudents} />
				</div>
			)}
		</>
	);
};

export default CourseEditPage;
