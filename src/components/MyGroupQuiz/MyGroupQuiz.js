import React, { useState, useEffect } from 'react'
import "./MyGroupQuiz.css"
import Loader from '../Loader/Loader';
import CreateGroupModal from './CreateGroupModal';
import CreateQuizModal from './CreateQuizModal'
import axios from '../../axios/axios';
import Carousel from 'react-elastic-carousel';
import SingleGroup from './SingleGroup';


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
    const [group, setGroup] = useState([]);

	const getGroup = async () => {
		console.log("getGroup called!!")
        try {
			if (!group) setLoading(true);
			const config = {
				headers: { Authorization: `Bearer ${user.access}` },
			};
			const { data } = await axios.get(
				`/api/create-group`,
				config,
			);

			setGroup(data?.response);
		} catch (err) {
			console.log(err.message);
		}
		setLoading(false);
	};

	useEffect(() => {
		getGroup();
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

                {group?.length === 0 && (
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

                <SingleGroup/>

                {group?.length > 0 && (
                    <div className="quiz-cards">
                        <Carousel breakPoints={breakPoints}>
                            {group?.map((group) => (
                                <SingleGroup
                                key = {group.id}
                                groupName = {group}/>
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
                user = {user}
                group = {group}
                setGroup = {setGroup}
                getGroup = {getGroup}
                setshowCreateGroup = { setshowCreateGroup} />
            }

            {
                showCreateQuiz && 
                <CreateQuizModal 
                userDetails = {user}
                group = {group}
                setShowCreateQuiz = {setShowCreateQuiz} />
            }
        </div>
    )
}

export default MyGroupQuiz
