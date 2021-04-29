import { useEffect, useRef, useState } from 'react';
import axios from '../../axios/axios';
import './SingleLessonEdit.css';

const ScheduleClass = ({
	setShowLessonEdit,
	mediaType,
	user,
	id,
	description,
	text_content,
	url,
	fetchLessonContent,
}) => {
	const [textContent, setTextContent] = useState(text_content);
	const [videoUrl, setVideoUrl] = useState(url);
	const [videoDescription, setVideoDescription] = useState(description);
	const [pdfFile, setPdfFile] = useState(null);

	const modalRef = useRef(null);

	const editLesson = async (postData) => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${user.access}` },
			};
			const { data } = await axios.patch(
				`/teacher/editLessonContent/${id}`,
				postData,
				config,
			);
			console.log(data);
			fetchLessonContent();
			setShowLessonEdit(false);
		} catch (err) {
			console.log(err.message);
		}
	};

	const editCourseContent = () => {
		if (mediaType === 'video') {
			const videoData = {
				link: videoUrl,
				link_desc: videoDescription,
			};
			console.log(videoData);
			editLesson(videoData);
		} else if (mediaType === 'text' || mediaType === 'homework') {
			const textData = {
				text_content: textContent,
			};
			console.log(textData);
			editLesson(textData);
		} else if (mediaType === 'pdf') {
			let formData = new FormData();

			formData.append('pdf', pdfFile);
			editLesson(formData);
		}
	};

	useEffect(() => {
		const handler = (e) => {
			if (!modalRef.current?.contains(e.target)) {
				setShowLessonEdit(false);
			}
		};
		window.addEventListener('click', handler);
		return () => window.removeEventListener('click', handler);
	});

	return (
		<div className="single-lesson-edit-modal">
			<div className="single-lesson-edit-card" ref={modalRef}>
				<h1>Edit {mediaType}</h1>

				{mediaType === 'text' || mediaType === 'homework' ? (
					<label>
						<p>Enter Text Content</p>
						<textarea
							name="text_coontent"
							value={textContent}
							onChange={(e) => setTextContent(e.target.value)}
						/>
					</label>
				) : (
					<></>
				)}
				{mediaType === 'quiz' || mediaType === 'assignment' ? (
					<h4>Edit these content in Myquiz Section</h4>
				) : (
					<></>
				)}

				{mediaType === 'pdf' && (
					<label>
						<p>Upload Document</p>
						<input
							type="file"
							onChange={(e) => setPdfFile(e.target.files[0])}
						/>
					</label>
				)}

				{mediaType === 'video' && (
					<div
						className="video-content"
						style={{
							display: 'flex',
							flexDirection: 'column',
							height: ' 150px',
							justifyContent: 'space-around',
						}}
					>
						<label>
							<p>Enter video url</p>
							<input
								type="text"
								name="video_url"
								value={videoUrl}
								onChange={(e) => setVideoUrl(e.target.value)}
							/>
						</label>
						<label>
							<p>Enter video Description</p>
							<textarea
								name="video_desc"
								value={videoDescription}
								onChange={(e) => setVideoDescription(e.target.value)}
							/>
						</label>
					</div>
				)}

				<div className="modal-btn">
					<button
						onClick={editCourseContent}
						disabled={mediaType === 'quiz' || mediaType === 'assignment'}
					>
						Edit Lesson Content
					</button>
					<button onClick={() => setShowLessonEdit(false)}>Cancel</button>
				</div>
			</div>
		</div>
	);
};

export default ScheduleClass;
