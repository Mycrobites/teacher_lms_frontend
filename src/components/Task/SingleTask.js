import { useState, useEffect, useRef, useContext } from 'react';
import axios from '../../axios/axios';
import months from '../../assets/months/months';
import { IoCloseOutline } from 'react-icons/io5';
import { MdCheckCircle, MdRadioButtonUnchecked } from 'react-icons/md';
import EditIcon from '@material-ui/icons/Edit';
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';
import UserContext from '../../context/authContext';

const SingleTasks = (props) => {
	const { id, title, dueDate, isComplete, tasks, setTasks, user } = props;
	const [isCompleted, setIsCompleted] = useState(isComplete);
	const [showEdit, setShowEdit] = useState(false);
	const [editTitle, setEditTitle] = useState(title);
	const [editDate, setEditDate] = useState(dueDate);
	const inputRef = useRef(null);
	const { userDetails } = useContext(UserContext);

	const updateTask = async () => {
		setShowEdit(!showEdit);
		try {
			const editedTask = {
				id,
				title: editTitle,
				dueDate: editDate,
				isComplete,
				user: user?.pk,
			};
			const updatedTasks = tasks.map((task) => {
				if (task.id === id) return editedTask;
				else return task;
			});
			setTasks(updatedTasks);
			localStorage.setItem('tasks', JSON.stringify(updatedTasks));
			const config = {
				headers: { Authorization: `Bearer ${userDetails.key}` },
			};
			await axios.put(`/api/todo/edit/${id}`, editedTask, config);
		} catch (err) {
			console.log(err.message);
		}
	};

	const deleteTask = async () => {
		try {
			const deletedTasks = tasks.filter((task) => task.id !== id);
			localStorage.setItem('tasks', JSON.stringify(deletedTasks));
			setTasks(deletedTasks);
			const config = {
				headers: { Authorization: `Bearer ${userDetails.key}` },
			};
			await axios.delete(`/api/todo/edit/${id}`, config);
		} catch (err) {
			console.log(err.message);
		}
	};

	const completeTodo = async () => {
		setIsCompleted(!isCompleted);
		const completedTask = {
			id,
			title,
			dueDate,
			isComplete: !isCompleted,
			user: user?.pk,
		};
		const completedTasks = tasks.map((task) => {
			if (task.id === id) return completedTask;
			else return task;
		});
		localStorage.setItem('tasks', JSON.stringify(completedTasks));
		try {
			const config = {
				headers: { Authorization: `Bearer ${userDetails.key}` },
			};
			await axios.put(`/api/todo/edit/${id}`, completedTask, config);
		} catch (err) {
			console.log(err.message);
		}
	};

	useEffect(() => {
		if (showEdit) inputRef.current.focus();
	}, [showEdit]);

	return (
		<div className="task-component">
			<div className="Task">
				<button className="check-btn" onClick={completeTodo}>
					{isCompleted ? <MdCheckCircle /> : <MdRadioButtonUnchecked />}
				</button>
				<div className="task-title">
					<h3 style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
						{title}
					</h3>
					<p>
						Due Date: {dueDate.split('-')[2]}{' '}
						{dueDate.split('-')[1] < 10
							? months[dueDate.split('-')[1].split('')[1] - 1]
							: months[dueDate.split('-')[1]]}{' '}
						{dueDate.split('-')[0]}
					</p>
				</div>
				<button onClick={() => setShowEdit(!showEdit)} className="edit--button">
					<EditIcon />
				</button>
				<button onClick={deleteTask} className="delete--button">
					<DeleteOutlineIcon />
				</button>
			</div>
			{showEdit && (
				<div className="edit-task">
					<form className="edit-task-form" onSubmit={updateTask}>
						<input
							type="text"
							placeholder="Add New Task"
							value={editTitle}
							onChange={(e) => setEditTitle(e.target.value)}
							ref={inputRef}
						/>
						<input
							type="date"
							value={editDate}
							onChange={(e) => setEditDate(e.target.value)}
						/>
						<button type="submit">save</button>
						<IoCloseOutline onClick={(e) => setShowEdit(!showEdit)} />
					</form>
				</div>
			)}
		</div>
	);
};

export default SingleTasks;
