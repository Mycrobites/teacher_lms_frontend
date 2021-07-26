import React, { useState, useEffect } from 'react'
import "./MyGroupQuiz.css"
import Loader from '../Loader/Loader';
import CreateGroupModal from './CreateGroupModal';
import CreateQuizModal from './CreateQuizModal'
import SingleQuiz from '../MyCourseQuiz/SingleQuiz';
import axios from '../../axios/axios';
import Carousel from 'react-elastic-carousel';


const breakPoints = [
	{ width: 1, itemsToShow: 1 },
	{ width: 500, itemsToShow: 2 },
	{ width: 900, itemsToShow: 3 },
	{ width: 1100, itemsToShow: 4 },
];

const MyGroupQuiz = ({user}) => {

    const [loading, setLoading] = useState(false);
    const[showCreateGroup, setshowCreateGroup] = useState(false);
    const[showCreateQuiz, setShowCreateQuiz] = useState(false);
    let groups = []

    const [quiz, setQuiz] = useState(null);

	const getCourses = async () => {
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
		getCourses();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loading) {
		return (
			<div className="loading-div">
				<Loader />
			</div>
		);
	}

    return (
        <div>
            <div className="my-quiz">
                <div style={{ marginBottom: '20px' }} className="title">
                    <h1
                        style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}
                    >
                        Welcome! {user.first_name}
                    </h1>
                    <h4 style={{ color: 'gray' }}>Here are All Your Group Quizzes</h4>
                </div>

                {quiz?.length === 0 && (
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: 200,
                            fontWeight: 600,
                            color: 'rgba(0,0,0,0.5)',
                        }}
                    >
                        You haven't created any group.
                    </p>
                )}

                {quiz?.length > 0 && (
                    <div className="quiz-cards">
                        <Carousel breakPoints={breakPoints}>
                            {quiz?.map((quiz) => (
                                <SingleQuiz
                                    key={quiz.id}
                                    {...quiz}
                                    user={user}
                                    getCourses={getCourses}
                                />
                            ))}
                        </Carousel>
                    </div>
                )}
		    </div>

            <div className="create-group-quiz">
                <button onClick={() => setshowCreateGroup(true)}>Create New Group</button>
                <button onClick={() => setShowCreateQuiz(true)}>Create Group Quiz</button>
            </div>

            { showCreateGroup && 
                <CreateGroupModal 
                groups = {groups}
                setshowCreateGroup = { setshowCreateGroup} />
            }

            {
                showCreateQuiz && 
                <CreateQuizModal 
                groups = {groups}
                setShowCreateQuiz = {setShowCreateQuiz} />
            }
        </div>
    )
}

export default MyGroupQuiz
