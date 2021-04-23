import { Avatar } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useContext } from 'react';

const SingleCourse = (props) => {
	const {
		id,
		image,
		course_name,
		course_description,
		author_profile_pic,
		author,
		author_name,
		totallesson,
	} = props;
	const history = useHistory();

	const handleClick = () => {
		history.push(`/courseedit/${id}`);
	};

	return (
		<div className="single-course-card">
			<div className="single-course-image">
				<img src={image} alt={course_name} />
			</div>
			<h2 className="single-course-title">{course_name}</h2>
			<div className="single-course-author">
				<Avatar src={author_profile_pic} />
				<h2>{author_name}</h2>
			</div>
			<p style={{ fontSize: '14px' }}>{course_description}</p>
			<p style={{ fontSize: '14px' }}>Total Lesson : {totallesson}</p>
			<div className="lessons">
				<button className="enrollment-course-btn" onClick={handleClick}>
					View
				</button>
			</div>
		</div>
	);
};

export default SingleCourse;
