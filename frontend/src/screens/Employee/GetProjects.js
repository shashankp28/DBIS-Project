import React, { useEffect, useState } from 'react';
import '../../App.css';
import buttons from '../../component/buttons';
import host from '../../data/host';
import getDataFromToken from '../../utils/getDataFromJWT';

// var projects = [];
const GetProjects = () => {
	const [projects, setprojects] = useState([]);
	const [token, setToken] = useState(window.localStorage.getItem('dbisToken'));
	const [userId, setUserId] = useState('');
	useEffect(() => {
		if (!token) {
			window.location = '/signin';
		}
		var user = getDataFromToken(token);
		if (user.isExp) {
			window.location = '/signin';
		}
		if (user.role !== '2') {
			window.location.href = '/unauthorized';
		}
		setUserId(user.email_id);
	}, [token]);
	const getAllProjects = () => {
		var axios = require('axios');
		var config = {
			method: 'get',
			url: `${host.host}/project`,
			headers: {
				Credentials: `Bearer ${window.localStorage.getItem('dbisToken')}`,
			},
		};

		axios(config)
			.then((res) => {
				setprojects(() => res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	useEffect(() => {
		getAllProjects();
	}, []);
	return (
		<div style={{ width: '100vw', overflow: 'hidden' }}>
			{projects.length > 0 ? (
				<div
					id="tableLandlord"
					className="w-full overflow-auto"
					style={{ width: '100vw', overflow: 'auto' }}
				>
					<h2>List of available projects</h2>
					{projects.length > 0 && (
						<table
							className="overflow-scroll"
							style={{ width: '100%', textAlign: 'center' }}
						>
							<thead>
								<tr>
									<th className="thx">Project Id</th>
									<th className="thx">Topic</th>
									<th className="thx">Description</th>
									<th className="thx">View Interns</th>
									<th className="thx">Delete</th>
								</tr>
							</thead>
							<tbody>
								{projects.map((el, ind) => {
									return (
										<tr key={el.project_id}>
											<td className="tdx">{el.project_id}</td>
											<td className="tdx">{el.topic}</td>
											<td className="tdx">{el.description}</td>
											<td className="tdx">
												<button
													style={buttons.button}
													className="defaultButtonHover1"
													onClick={() => {
														window.location.href = `/view-project-interns?id=${el.project_id}`;
													}}
												>
													View Interns
												</button>
											</td>
											<td className="tdx">
												<button
													style={buttons.button}
													className="defaultButtonHover1"
													onClick={() => {
														if (window.confirm('Are you sure to delete')) {
															var axios = require('axios');
															var config = {
																method: 'delete',
																url: `${host.host}/project?project_id=${el.project_id}`,

																headers: {
																	Credentials: `Bearer ${window.localStorage.getItem(
																		'dbisToken'
																	)}`,
																},
															};
															axios(config)
																.then((res) => {
																	console.log(res.data);
																	getAllProjects();
																})
																.catch((err) => console.log(err));
														}
													}}
												>
													Delete
												</button>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>
			) : (
				<div>No project available.</div>
			)}
		</div>
	);
};

export default GetProjects;
