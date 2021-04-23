import { useState, useEffect, useRef, useContext } from 'react';
import Course from './Course';
import Loader from '../Loader/Loader';
import axios from '../../axios/axios';
import { useHistory } from 'react-router-dom';
import './Courses.css';
import UserContext from '../../context/authContext';

const getCoursesFromLocalStorage = () => {
	const course = localStorage.getItem('courses');
	if (course) {
		return JSON.parse(course);
	} else {
		return null;
	}
};

const Courses = ({ user }) => {
	const [courses, setCourses] = useState(getCoursesFromLocalStorage);
	const [isLoading, setIsLoading] = useState(false);
	const history = useHistory();
	const mountedRef = useRef(true);
	const { userDetails } = useContext(UserContext);

	useEffect(() => {
		// let isUnmounted = false;
		const fetchCourses = async () => {
			if (!courses) setIsLoading(true);
			try {
				const config = {
					headers: { Authorization: `Bearer ${userDetails.access}` },
				};
				const { data } = await axios.get(
					`/teacher/getMyCourses/${user?.username}`,
					config,
				);
				console.log(data);
				if (mountedRef.current) {
					const courseData = data.filter((course, index) => index < 2);
					setCourses(courseData);
					localStorage.setItem('courses', JSON.stringify(courseData));
				}
			} catch (err) {
				console.log(err.message);
			}
			setIsLoading(false);
		};
		fetchCourses();
		return function cleanup() {
			mountedRef.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [courses]);

	return (
		<div className="Courses">
			<h2>My Courses</h2>
			{isLoading ? (
				<Loader />
			) : (
				<>
					<div className="course-cards">
						{courses?.map((course) => (
							<Course key={course.sno} {...course} />
						))}
					</div>
					<button
						onClick={() => history.push('/course')}
						className="all-courses-btn"
					>
						See all
					</button>
				</>
			)}
		</div>
	);
};

export default Courses;
