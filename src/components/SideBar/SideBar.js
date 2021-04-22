import { Link } from 'react-router-dom';
// import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';

import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';

import CollectionsBookmarkOutlinedIcon from '@material-ui/icons/CollectionsBookmarkOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';
import './SideBar.css';

const SideBar = ({ active }) => {
	return (
		<div className="sidebar">
			<div className="sidebar-responsive">
				{/* <div id={active === "home" ? "active" : ""} className="menu home-menu">
          <Link to="/">
            <HomeOutlinedIcon />
          </Link>
        </div> */}
				<div id={active === 'dashboard' ? 'active' : ''} className="menu">
					<Link to="/">
						<DashboardOutlinedIcon />
					</Link>
				</div>
				<div id={active === 'course' ? 'active' : ''} className="menu">
					<Link to="/course">
						<CollectionsBookmarkOutlinedIcon />
					</Link>
				</div>
				<div id={active === 'quiz' ? 'active' : ''} className="menu">
					<Link to="/quiz">
						<AssignmentOutlinedIcon />
					</Link>
				</div>
				<div id={active === 'forum' ? 'active' : ''} className="menu">
					<Link to="/forum">
						<ForumOutlinedIcon />
					</Link>
				</div>
			</div>

			<div className="sidebar-menu">
				{/* <div id={active === "home" ? "active" : ""} className="menu">
          <Link to="/">
            <HomeOutlinedIcon />
            Home
          </Link>
        </div> */}
				<div id={active === 'dashboard' ? 'active' : ''} className="menu">
					<Link to="/">
						<DashboardOutlinedIcon />
						Dashboard
					</Link>
				</div>
				<div id={active === 'course' ? 'active' : ''} className="menu">
					<Link to="/course">
						<CollectionsBookmarkOutlinedIcon />
						My Courses
					</Link>
				</div>
				<div id={active === 'quiz' ? 'active' : ''} className="menu">
					<Link to="/quiz">
						<AssignmentOutlinedIcon />
						Quiz
					</Link>
				</div>
				<div id={active === 'forum' ? 'active' : ''} className="forum menu">
					<Link to="/forum">
						<ForumOutlinedIcon />
						Forum
					</Link>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
