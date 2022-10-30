import React, { useEffect, useState } from 'react';
import '../../App.css';
import buttons from '../../component/buttons';
import host from '../../data/host';
import getDataFromToken from '../../utils/getDataFromJWT';

// var users = [];
const GetEmployees = () => {
	const [users, setUsers] = useState([]);
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
		if (user.role !== '1') {
			window.location.href = '/unauthorized';
		}
		setUserId(user.email_id);
	}, [token]);
	const assignUser = () => {
		var axios = require('axios');
		var config = {
			method: 'get',
			url: `${host.host}/employee`,
			headers: {
				Credentials: `Bearer ${window.localStorage.getItem('dbisToken')}`,
			},
		};

		axios(config)
			.then((res) => {
				setUsers(() => res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};
	useEffect(() => {
		assignUser();
	}, []);
	return (
		<div style={{ width: '100vw', overflow: 'hidden' }}>
			{users.length > 0 ? (
				<div
					id="tableLandlord"
					className="w-full overflow-auto"
					style={{ width: '100vw', overflow: 'auto' }}
				>
					<h2>List of All Employees</h2>
					{users.length > 0 && (
						<table
							className="overflow-scroll"
							style={{ width: '100%', textAlign: 'center' }}
						>
							<thead>
								<tr>
									<th className="thx">First Name</th>
									<th className="thx">Last Name</th>
									<th className="thx">Phone number</th>
									<th className="thx">Email Id</th>
									<th className="thx">View</th>
									<th className="thx">Delete</th>
								</tr>
							</thead>
							<tbody>
								{users.map((el, ind) => {
									return (
										<tr key={el.details.phone}>
											<td className="tdx">{el.details.first_name}</td>
											<td className="tdx">{el.details.last_name}</td>
											<td className="tdx">{el.details.phone}</td>
											<td className="tdx">{el.email_id}</td>
											<td className="tdx">
												<button
													style={buttons.button}
													className="defaultButtonHover1"
													onClick={() => {
														window.location.href = `/view-profile?id=${el.email_id}`;
													}}
												>
													View
												</button>
											</td>
											<td className="tdx">
												<button
													style={buttons.button}
													className="defaultButtonHover1"
													onClick={() => {
														if (
															window.confirm('Are you sure to delete') === true
														) {
															var axios = require('axios');
															var config = {
																method: 'delete',
																url: `${host.host}/employee?email_id=${el.email_id}`,

																headers: {
																	Credentials: `Bearer ${window.localStorage.getItem(
																		'dbisToken'
																	)}`,
																},
															};
															axios(config)
																.then((res) => {
																	console.log(res.data);
																	assignUser();
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
				<div>No Employee found</div>
			)}
		</div>
	);
};

export default GetEmployees;
