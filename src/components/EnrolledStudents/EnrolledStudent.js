import React from 'react';
import './EnrolledStudent.css';
import SingleStudent from './SingleStudent';

const EnrolledStudent = ({ students }) => {
	return (
		<div className="enrolled-student">
			<h2>Enrolled Students : {students?.length}</h2>
			<div className="enrolled-student-wrapper">
				{students?.map((student) => (
					<SingleStudent key={student.sno} {...student} />
				))}
			</div>
		</div>
	);
};

export default EnrolledStudent;
