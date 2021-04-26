import React from 'react';
import './EnrolledStudent.css';
import Avatar from '@material-ui/core/Avatar';

const SingleStudent = (props) => {
	const {
		date_of_enrollment,
		course_complete_percentage,
		student_name,
		student_profile_pic,
	} = props;
	const enrolled_date = date_of_enrollment.split('-').reverse().join('-');
	return (
		<div className="single-student">
			<div className="student-left">
				<Avatar src={student_profile_pic} alt={student_name} />
			</div>
			<div className="student-right">
				<h4>{student_name}</h4>
				<p>Enrolled on : {enrolled_date} </p>
				<label className="student-progress">
					<p>Progress : {course_complete_percentage} </p>
					<progress value={course_complete_percentage} max="100" />
				</label>
			</div>
		</div>
	);
};

export default SingleStudent;
