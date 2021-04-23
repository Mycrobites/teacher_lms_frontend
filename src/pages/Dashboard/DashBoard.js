import SideBar from '../../components/SideBar/SideBar';
import LiveClasses from '../../components/LiveClasses/LiveClasses';
import Calendar from '../../components/Calendar/Calendar';
import Courses from '../../components/Courses/Courses';
import Task from '../../components/Task/Task';
import './DashBoard.css';
import { useContext } from 'react';
import UserContext from '../../context/authContext';

const DashBoard = () => {
	const { userDetails } = useContext(UserContext);

	return (
		<div className="Dashboard">
			<SideBar active="dashboard" />
			<div className="dashboard-items">
				<LiveClasses user={userDetails} />
				<Task user={userDetails} />
				<Calendar />
				<Courses user={userDetails} />
			</div>
		</div>
	);
};

export default DashBoard;
