import React, { useContext, useState, useEffect, useRef } from 'react';
import './UniqueCourse.css';
import { VscFilePdf } from 'react-icons/vsc';
import { AiOutlineFileText } from 'react-icons/ai';
import { BiTask } from 'react-icons/bi';
import { MdAssignment } from 'react-icons/md';
import { IoIosPlayCircle } from 'react-icons/io';
import { FaHandMiddleFinger } from 'react-icons/fa';
import { MdCheckBoxOutlineBlank } from 'react-icons/md';
import { MdCheckBox } from 'react-icons/md';
import axios from '../../axios/axios';
import UserContext from '../../context/authContext';

const SingleLessonContent = ({ singleContent, user, id, index, lessonId }) => {
	// console.log(singleContent);

	const { userDetails } = useContext(UserContext);

	const clickRef = useRef(null);

	const toggleIcon = () => {
		switch (singleContent?.media_type) {
			case 'text':
				return <AiOutlineFileText />;
			case 'quiz':
				return <MdAssignment />;
			case 'video':
				return <IoIosPlayCircle />;
			case 'homework':
				return <BiTask />;
			case 'pdf':
				return <VscFilePdf />;
			case 'assignment':
				return <MdAssignment />;
			default:
				return <FaHandMiddleFinger />;
		}
	};

	return (
		<div ref={clickRef} className="single-lesson-content">
			<div className="lesson-left">
				<div className="label">
					<div>{singleContent?.media_type}</div>
				</div>
			</div>
			<p>{toggleIcon()}</p>
		</div>
	);
};

export default SingleLessonContent;
