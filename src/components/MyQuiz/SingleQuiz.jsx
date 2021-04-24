import React from 'react';
import { useHistory } from 'react-router-dom';

const SingleQuiz = (props) => {
	const {
		belongs_to,
		duration,
		expire_date,
		quiz_title,
		start_date,
		id,
	} = props;

	const history = useHistory();

	const handleClick = () => {
		history.push(`/quizedit/${id}`);
	};

	return (
		<div className="single-course-card single-quiz">
			<h2 className="single-course-title">{quiz_title}</h2>
			<div className="single-course-author">
				<h2>{belongs_to}</h2>
				<h5>Duration : {duration}</h5>
			</div>
			<p style={{ fontSize: '14px', fontWeight: '500' }}>
				Start on : {start_date}
			</p>
			<p style={{ fontSize: '14px', fontWeight: '500' }}>
				Ends on : {expire_date}
			</p>
			<div className="lessons">
				<button className="enrollment-course-btn" onClick={handleClick}>
					View
				</button>
			</div>
		</div>
	);
};

export default SingleQuiz;
