import { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import axios from '../../axios/axios';
import login_image from '../../assets/images/login.png';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import './Login.css';
import UserContext from '../../context/authContext';
import Loader from '../../components/Loader/Loader';
import Error from '../../components/ErrorComponent/Error';

const Login = () => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [loading, setLoading] = useState(false);
	const [showPassword, setShowPassword] = useState(false);
	const [error, setError] = useState({
		username: '',
		password: '',
	});
	const history = useHistory();
	const { updateUser, updateUserProfilePic } = useContext(UserContext);

	const fetchUser = async () => {
		setLoading(true);
		try {
			const { data } = await axios.post('/teacher/login', {
				username: username.trim(),
				password: password,
			});
			setLoading(false);
			updateUser(data);
			updateUserProfilePic(data.profile_pic);
			history.push('/dashboard');
		} catch (err) {
			setError({
				username: 'Invalid credentials',
				password: 'Invalid credentials',
			});
			setLoading(false);
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!username && !password) {
			return setError({
				username: 'Please enter username!',
				password: 'Please enter password!',
			});
		} else if (!username) {
			setError({
				username: 'Please enter username!',
				password: '',
			});
		} else if (!password) {
			setError({
				username: '',
				password: 'Please enter password!',
			});
		} else {
			setError({
				username: '',
				password: '',
			});
		}
		fetchUser();
	};

	return (
		<div className="login-page">
			<div className="login-clip-path"></div>
			{loading && (
				<div className="login-loader">
					<Loader />
				</div>
			)}
			<div className="login-page-contents">
				<div className="login-image">
					<img src={login_image} alt="login" />
				</div>
				<div className="form-holder">
					<form onSubmit={handleSubmit}>
						<div className="username">
							<label>
								Username
								<input
									type="text"
									value={username}
									placeholder="Enter username..."
									onChange={(e) => setUsername(e.target.value)}
								/>
								{error.username && <Error msg={error.username} />}
							</label>
						</div>
						<div className="password">
							<label>
								Password
								<input
									type={showPassword ? 'text' : 'password'}
									value={password}
									placeholder="Enter password..."
									onChange={(e) => setPassword(e.target.value)}
								/>
								<div
									onClick={() => setShowPassword(!showPassword)}
									className="show-password"
								>
									{showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
								</div>
								{error.password && <Error msg={error.password} />}
							</label>
						</div>
						<button onClick={handleSubmit} type="submit">
							Log in
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Login;
