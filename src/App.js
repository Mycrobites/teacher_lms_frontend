import {
	BrowserRouter as Router,
	Route,
	Switch,
	Redirect,
} from 'react-router-dom';
import { useContext } from 'react';
import DashBoard from './pages/Dashboard/DashBoard';
import Forum from './pages/Forum/Forum';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import NavBar from './components/NavBar/NavBar';
import ProfilePage from './pages/Profile/ProfilePage';
import Login from './pages/LoginPage/Login';
import UserContext from './context/authContext';

const App = () => {
	const { userDetails } = useContext(UserContext);

	return (
		<Router>
			<div className="App">
				{userDetails && <NavBar />}
				<Switch>
					<Route exact path="/">
						{!userDetails ? <Login /> : <Redirect to="/dashboard" />}
					</Route>
					<Route exact path="/dashboard">
						{userDetails ? <DashBoard /> : <Redirect to="/" />}
					</Route>
					<Route exact path="/forum">
						{userDetails ? <Forum /> : <Redirect to="/" />}
					</Route>
					<Route exact path="/profile">
						{userDetails ? <ProfilePage /> : <Redirect to="/" />}
					</Route>
					<Route path="*">
						<ErrorPage />
					</Route>
				</Switch>
			</div>
		</Router>
	);
};

export default App;
