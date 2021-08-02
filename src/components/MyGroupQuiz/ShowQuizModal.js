import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { IoCloseOutline } from 'react-icons/io5';
import SingleGroupQuiz from "./SingleGroupQuiz";
import axios from '../../axios/axios'
import UserContext from '../../context/authContext'

const ShowQuizModal = ( { setShowQuiz }) => {

	const { user } = useContext(UserContext);
    const[loading, setLoading] =useState(false);
    const[quiz, setQuiz] = useState(null);
    
    const getGroupQuiz = async () => {
		try {
			if (!quiz) setLoading(true);
			const config = {
				headers: { Authorization: `Bearer ${user.access}` },
			};
			const { data } = await axios.get(
				`/teacher/quiz/getQuiz/${user.username}`,
				config,
			);

			setQuiz(data?.response);
		} catch (err) {
			console.log(err.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		getGroupQuiz();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

    return (
        <div className="edit-quiz-modal">
			<div className="edit-quiz-modal-card">
				<h1>Edit Quiz</h1>
				<button onClick={() => setShowQuiz(false)} className="close-btn">
					<IoCloseOutline />
				</button>

                {
                    quiz?.length > 0 && 
                    (
                        <div className="quiz-cards">
                            {quiz?.map((quiz) => (
                                <SingleGroupQuiz
                                    key={quiz.id}
                                    {...quiz}
                                    user={user}
                                    getGroupQuiz={getGroupQuiz}
                                />
                            ))}
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default ShowQuizModal
