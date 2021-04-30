import React, { useState, useContext, useEffect } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
// import { Checkbox } from "@material-ui/core";
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import { AiOutlineDelete } from 'react-icons/ai';
import { MdEdit } from 'react-icons/md';
import './UniqueCourse.css';
import SingleLessonContent from './SingleLessonContent';
import axios from '../../axios/axios';
import CourseContentModal from '../CourseContentModal/CourseContentModal';

const SingleCourseContent = ({
	user,
	lesson,
	index,
	id,
	course_id,
	fetchLessonContent,
}) => {
	const [showContent, setShowContent] = useState(false);
	const [showNewContent, setShowNewContent] = useState(false);
	const [showEdit, setShowEdit] = useState(false);
	const [showDelete, setShowDelete] = useState(false);
	const [lessonName, setLessonName] = useState(lesson?.name);
	const [lessonDescription, setLessonDescription] = useState(lesson?.desp);
	const [lessonNumber, setLessonNumber] = useState(lesson?.lessonno);

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

	const editLesson = async () => {
		const postData = {
			course: course_id,
			name: lessonName,
			desp: lessonDescription,
			lessonno: lessonNumber,
		};

		try {
			const config = {
				headers: { Authorization: `Bearer ${user.access}` },
			};

			const { data } = await axios.put(
				`/teacher/editLesson/${id}`,
				postData,
				config,
			);
			console.log(data);
			setShowEdit(false);
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
						Lesson {lesson?.lesson_no} : {lesson?.lesson_name}
					</h5>
					<p>{lesson?.description}</p>
				</div>

				<div className="single-course-btn">
					<button>
						{!showContent ? <ExpandMoreIcon /> : <ExpandLessIcon />}
					</button>
					<button onClick={() => setShowNewContent(true)}>
						<AiOutlineAppstoreAdd />
					</button>
					<button onClick={() => setShowDelete(true)}>
						<AiOutlineDelete />
					</button>
					<button onClick={() => setShowEdit(true)}>
						<MdEdit />
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

				{showEdit && (
					<div className="course-modal-wrapper ">
						<div className="course-modal lesson-modal">
							<label>
								<p>Lesson Name</p>
								<input
									type="text"
									value={lessonName}
									onChange={(e) => setLessonName(e.target.value)}
									placeholder="Lesson name"
								/>
							</label>

							<label>
								<p>Lesson Description</p>
								<textarea
									name="Lesson-description"
									value={lessonDescription}
									onChange={(e) => setLessonDescription(e.target.value)}
									placeholder="Enter lesson description"
								/>
							</label>

							<label>
								<p>Lesson Number</p>
								<input
									name="lesson_no"
									type="number"
									value={lessonNumber}
									onChange={(e) => setLessonNumber(e.target.value)}
									placeholder="Enter lesson number"
								/>
							</label>

							<div className="edit-modal-btn">
								<button onClick={editLesson}>Edit Lesson</button>
								<button onClick={() => setShowEdit(false)}>Cancel</button>
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
							user={user}
							fetchLessonContent={fetchLessonContent}
							courseIndex={index}
						/>
					))}
				</div>
			)}

			{showNewContent && (
				<CourseContentModal
					id={id}
					user={user}
					fetchLessonContent={fetchLessonContent}
					setShowNewContent={setShowNewContent}
				/>
			)}
		</div>
	);
};

export default SingleCourseContent;
