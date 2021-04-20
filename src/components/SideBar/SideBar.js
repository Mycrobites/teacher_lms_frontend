import { Link } from 'react-router-dom';
// import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import DashboardOutlinedIcon from '@material-ui/icons/DashboardOutlined';
import NoteAddOutlinedIcon from '@material-ui/icons/NoteAddOutlined';
import ForumOutlinedIcon from '@material-ui/icons/ForumOutlined';
import EmojiEventsOutlinedIcon from '@material-ui/icons/EmojiEventsOutlined';
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
				{/*<div id={active === 'enrollment' ? 'active' : ''} className="menu">
					<Link to="/enrollment">
						<NoteAddOutlinedIcon />
					</Link>
				</div>
				<div id={active === 'achievement' ? 'active' : ''} className="menu">
					<Link to="/achievement">
						<EmojiEventsOutlinedIcon />
					</Link>
    </div>*/}
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
				{/*<div id={active === 'enrollment' ? 'active' : ''} className="menu">
					<Link to="/enrollment">
						<NoteAddOutlinedIcon />
						My Enrollments
					</Link>
				</div>
				<div id={active === 'achievement' ? 'active' : ''} className="menu">
					<Link to="/achievement">
						<EmojiEventsOutlinedIcon />
						Achievements
					</Link>
    </div>*/}
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
