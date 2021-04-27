import React, { useState } from 'react';
import axios from '../../axios/axios';
import SingleCourseContent from './SingleCourseContent';
import { MdPlaylistAdd } from 'react-icons/md';

const CourseContent = ({ lessons, user, id, fetchLessonContent }) => {
	const [showNewLesson, setShowNewLesson] = useState(false);
	const [lessonName, setLessonName] = useState('');
	const [lessonDescription, setLessonDescription] = useState('');
	const [lessonNumber, setLessonNumber] = useState();

	const createLesson = async () => {
		const postData = {
			course: id,
			name: lessonName,
			desp: lessonDescription,
			lessonno: lessonNumber,
		};

		try {
			const config = {
				headers: { Authorization: `Bearer ${user.access}` },
			};

			const { data } = await axios.post(
				'/teacher/createLesson',
				postData,
				config,
			);
			console.log(data);
			setShowNewLesson(false);
			fetchLessonContent();
		} catch (err) {
			console.log(err.message);
		}
	};

	return (
		<div className="course-content">
			<div className="course-content-header">
				<h4>Course content</h4>
				<button
					className="add-lesson-btn"
					onClick={() => setShowNewLesson(true)}
				>
					<MdPlaylistAdd /> Lesson{' '}
				</button>
			</div>

			{showNewLesson && (
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

						<div className="modal-btn">
							<button onClick={createLesson}>Create Lesson</button>
							<button onClick={() => setShowNewLesson(false)}>Cancel</button>
						</div>
					</div>
				</div>
			)}

			{lessons?.map((lesson, idx) => (
				<SingleCourseContent
					key={lesson.id}
					id={lesson.id}
					course_id={id}
					index={idx}
					lesson={lesson}
					user={user}
					fetchLessonContent={fetchLessonContent}
				/>
			))}
		</div>
	);
};

export default CourseContent;
