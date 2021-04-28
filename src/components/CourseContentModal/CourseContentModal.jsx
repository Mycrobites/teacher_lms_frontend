import React, { useState } from 'react';
import axios from '../../axios/axios';
import './CourseContenntModal.css';

const CourseContentModal = ({
	setShowNewContent,
	id,
	user,
	fetchLessonContent,
}) => {
	const [mediaType, setMediaType] = useState('text');
	const [textContent, setTextContent] = useState('');
	const [videoUrl, setVideoUrl] = useState('');
	const [videoDescription, setVideoDescription] = useState('');
	const [pdfFile, setPdfFile] = useState(null);

	const mediaList = ['text', 'video', 'homework', 'pdf', 'quiz', 'assignment'];

	// const postData = {
	// 	media_type: '',
	// 	lesson: '',
	// 	link: '',
	// 	link_desc: '',
	// 	text_content: ' ',
	// 	pdf: '',
	// };

	const sendCreateRequest = async (data) => {
		try {
			const config = {
				headers: { Authorization: `Bearer ${user.access}` },
			};
			const post = await axios.post(
				'/teacher/createlessoncontent/',
				data,
				config,
			);
			console.log(post);
			setShowNewContent(false);
			fetchLessonContent();
		} catch (err) {
			console.log(err.message);
		}
	};

	const createCourseContent = () => {
		if (mediaType === 'video') {
			const videoData = {
				media_type: mediaType,
				lesson: id,
				link: videoUrl,
				link_desc: videoDescription,
			};
			console.log(videoData);
			sendCreateRequest(videoData);
			return;
		} else if (mediaType === 'text' || mediaType === 'homework') {
			const textData = {
				media_type: mediaType,
				lesson: id,
				text_content: textContent,
			};
			console.log(textData);
			sendCreateRequest(textData);
			return;
		} else if (mediaType === 'pdf') {
			let formData = new FormData();
			formData.append('media_type', mediaType);
			formData.append('lesson', id);
			formData.append('pdf', pdfFile);

			sendCreateRequest(formData);
			return;
		}
	};

	return (
		<div className="course-content-modal">
			<div className="course-modal create-course-modal">
				<label style={{ flexDirection: 'column', display: 'flex' }}>
					<p>Select Content Type</p>
					<select
						value={mediaType}
						onChange={(e) => setMediaType(e.target.value)}
					>
						{mediaList?.map((media, idx) => (
							<option key={idx} value={media}>
								{media}
							</option>
						))}
					</select>
				</label>

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
					<button onClick={createCourseContent}>Create Lesson Content</button>
					<button onClick={() => setShowNewContent(false)}>Cancel</button>
				</div>
			</div>
		</div>
	);
};

export default CourseContentModal;
