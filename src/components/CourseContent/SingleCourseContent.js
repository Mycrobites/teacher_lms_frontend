import React, { useState, useContext } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
// import { Checkbox } from "@material-ui/core";
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import { RiDeleteBin4Line } from 'react-icons/ri';
import './UniqueCourse.css';
import SingleLessonContent from './SingleLessonContent';
import axios from '../../axios/axios';

const SingleCourseContent = ({
	user,
	lesson,
	index,
	id,
	fetchLessonContent,
}) => {
	const [showContent, setShowContent] = useState(false);
	const [showNewContent, setShowNewContent] = useState(false);
	const [showDelete, setShowDelete] = useState(false);

	const handleDelete = async () => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${user.access}` },
			};
			const { data } = await axios.delete(`/teacher/editLesson/${id}`, config);
			setShowDelete(false);
			fetchLessonContent();
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<div className="single-course-content">
			<div onClick={() => setShowContent(!showContent)} className="lesson_name">
				<div>
					<h5>
						Lesson {lesson?.lessonno} : {lesson?.name}
					</h5>
					<p>{lesson?.desp}</p>
				</div>

				<div className="single-course-btn">
					<button>
						{!showContent ? <ExpandMoreIcon /> : <ExpandLessIcon />}
					</button>
					<button onClick={() => setShowNewContent(true)}>
						<AiOutlineAppstoreAdd />
					</button>
					<button onClick={() => setShowDelete(true)}>
						<RiDeleteBin4Line />
					</button>
				</div>

				{showDelete && (
					<div className="delete-modal-wrapper">
						<div className="delete-modal">
							<p>Are you sure you want to delete your course ?</p>
							<div className="lesson-delete-modal-btn">
								<button onClick={() => setShowDelete(false)}>Cancel</button>
								<button onClick={handleDelete}>Proceed and Delete</button>
							</div>
						</div>
					</div>
				)}
			</div>
			{showContent && (
				<div className="lesson_content">
					{lesson?.contents?.map((content, idx) => (
						<SingleLessonContent
							key={idx}
							index={idx}
							id={content?.content_id}
							lessonId={lesson?.lesson_id}
							singleContent={content}
						/>
					))}
				</div>
			)}
		</div>
	);
};

export default SingleCourseContent;
