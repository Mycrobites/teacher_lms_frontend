import React from 'react'
import { useState } from 'react'
import ShowQuizModal from './ShowQuizModal';

const SingleGroup = (props) => {

	const[showQuiz, setShowQuiz ] =useState(false);

	return (
		<div>
			Hello
			{/* //{props.groupName} */}
			<button 
				onClick= {() => setShowQuiz(true) } >Show Quizes</button>
			{
				showQuiz &&
				<ShowQuizModal 
				setShowQuiz = {setShowQuiz}/> 
			}
		</div>
	)
}

export default SingleGroup
