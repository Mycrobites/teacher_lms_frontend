import { useState, useEffect } from 'react';
import axios from 'axios';

const Sidebar = ({ sidebarData }) => {
	const [blogs, setBlogs] = useState(null);

	useEffect(() => {
		const fetchBlogs = async () => {
			try {
				const { data } = await axios.get(
					'https://blog.mycrobites.com/api/blogs',
				);
				setBlogs(data);
			} catch (err) {
				console.log(err.message);
			}
		};
		fetchBlogs();
	}, []);

	return (
		<div className="forum-sidebar">
			<div className="stats">
				<p>
					Total Posts : {sidebarData?.posts > 999 ? '999+' : sidebarData?.posts}
				</p>
				<p>
					Total Answers :{' '}
					{sidebarData?.answers > 999 ? '999+' : sidebarData?.answers}
				</p>
			</div>
			<div className="blogs">
				<h2>Blogs</h2>
				{blogs?.map((blog) => (
					<div key={blog.sno} className="single-blog">
						<h3>{blog.title}</h3>
						<img
							src={`https://blog.mycrobites.com${blog.img}`}
							alt={blog.title}
						/>
					</div>
				))}
				<a href="https://blog.mycrobites.com" target="_blank" rel="noreferrer">
					visit blog website
				</a>
			</div>
		</div>
	);
};

export default Sidebar;
