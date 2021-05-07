import React, { useState, useContext, useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import './EnrolledPage.css';
import UserContext from '../../context/authContext';
import axios from '../../axios/axios';
import EnrolledStudent from '../../components/EnrolledStudents/EnrolledStudent';

const EnrolledPage = () => {
	const { id } = useParams();
	const history = useHistory();
	const [enrolledStudents, setEnrolledStudents] = useState(null);
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

	useEffect(() => {
		fetchEnrolledStudent();
	}, []);

	return (
		<div className="enrolled-page">
			<EnrolledStudent students={enrolledStudents} />
		</div>
	);
};

export default EnrolledPage;
