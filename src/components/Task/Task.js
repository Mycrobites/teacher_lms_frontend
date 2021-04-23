import { useState, useEffect, useContext } from 'react';
import axios from '../../axios/axios';
import SingleTask from './SingleTask';
import Loader from '../Loader/Loader';
import { IoAdd, IoCloseOutline, IoWarningOutline } from 'react-icons/io5';
import './Task.css';
import UserContext from '../../context/authContext';

const getTasksFromLocalStorage = () => {
	const task = localStorage.getItem('tasks');
	if (task) {
		return JSON.parse(task);
	} else {
		return null;
	}
};

const Task = ({ user }) => {
	const [tasks, setTasks] = useState(getTasksFromLocalStorage);
	const [isLoading, setIsLoading] = useState(false);
	const [showInput, setShowInput] = useState(false);
	const [isError, setIsError] = useState(false);
	const [newTask, setNewTask] = useState('');
	const [dueDate, setDueDate] = useState('');
	const { userDetails } = useContext(UserContext);

	useEffect(() => {
		let isUnmounted = false;
		const fetchTasks = async () => {
			try {
				const config = {
					headers: { Authorization: `Bearer ${userDetails.access}` },
				};
				const { data } = await axios.get(`/api/todo/${user?.username}`, config);
				if (!isUnmounted) {
					setTasks(data);
					localStorage.setItem('tasks', JSON.stringify(data));
				}
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchTasks();
		return () => {
			isUnmounted = true;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tasks]);

	const addTodo = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			if (tasks.length === 10) {
				alert("You can't add more than 10 tasks");
			} else {
				if (newTask.length > 0 && dueDate) {
					const config = {
						headers: { Authorization: `Bearer ${user.access}` },
					};
					const { data } = await axios.post(
						'/api/todo/create',
						{
							title: newTask,
							dueDate: dueDate,
							isComplete: false,
							user: user.user_id,
						},
						config,
					);
					setTasks([...tasks, data]);
					setNewTask('');
					setDueDate('');
					setShowInput(false);
				} else {
					setIsError(true);
				}
			}
		} catch (err) {
			console.log(err.message);
		}
		setIsLoading(false);
	};

	// useEffect(() => {
	// 	const error = setTimeout(() => {
	// 		setIsError(false);
	// 	}, 3000);
	// 	return () => clearTimeout(error, 3000);
	// }, [isError]);

	return (
		<div className="Tasks">
			{isLoading && (
				<div className="loading-div">
					<Loader />
				</div>
			)}
			<div className="task-header">
				<h1>Tasks</h1>
				<button onClick={() => setShowInput(!showInput)}>
					{showInput ? <IoCloseOutline /> : <IoAdd />}
				</button>
			</div>
			{tasks?.length === 0 && (
				<p className="no-task">You haven't added any task</p>
			)}
			<div className="Tasks-main-div">
				{showInput && (
					<div className="add-newtask">
						<form onSubmit={addTodo}>
							<input
								type="text"
								placeholder="Add New Task"
								value={newTask}
								onChange={(e) => setNewTask(e.target.value)}
							/>
							<input
								type="date"
								value={dueDate}
								onChange={(e) => setDueDate(e.target.value)}
							/>
							{isError && (
								<div className="error">
									<IoWarningOutline />
									<h3>All fields must be filled</h3>
								</div>
							)}
							<button type="submit">Add</button>
						</form>
					</div>
				)}
				{isLoading && <Loader />}
				<div className="tasks">
					{tasks?.map((task) => (
						<SingleTask
							key={task.id}
							{...task}
							tasks={tasks}
							setTasks={setTasks}
							user={user}
						/>
					))}
				</div>
			</div>
		</div>
	);
};

export default Task;
