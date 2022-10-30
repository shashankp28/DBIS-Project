import React, { useEffect, useState } from 'react';
import '../../App.css';
import buttons from '../../component/buttons';
import host from '../../data/host';
import getDataFromToken from '../../utils/getDataFromJWT';

// var users = [];
const ViewProjectInterns = () => {
	const [users, setUsers] = useState([]);
	const [myInterns, setMyInterns] = useState([]);
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
	const getAllUsers = () => {
		var axios = require('axios');
		var config = {
			method: 'get',
			url: `${host.host}/assigned-interns-to-projects?project_id=${new URL(
				window.location.href
			).searchParams.get('id')}`,
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
	const getMyInterns = () => {
		var axios = require('axios');
		var config = {
			method: 'get',
			url: `${host.host}/get-my-interns`,
			headers: {
				Credentials: `Bearer ${window.localStorage.getItem('dbisToken')}`,
			},
		};

		axios(config)
			.then((res) => {
				setMyInterns(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	};

	useEffect(() => {
		getAllUsers();
		getMyInterns();
	}, []);

	const checkIsMyIntern = (email_id) => {
		var isMyIntern = false;
		myInterns.forEach((element) => {
			if (element.email_id === email_id) isMyIntern = true;
		});
		return isMyIntern;
	};
	return (
		<div style={{ width: '100vw', overflow: 'hidden' }}>
			{users.length > 0 ? (
				<div
					id="tableLandlord"
					className="w-full overflow-auto"
					style={{ width: '100vw', overflow: 'auto' }}
				>
					<h2>List of Interns working on Selected Project</h2>
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
									<th className="thx">View Profile</th>
									<th className="thx">Remove from Project</th>
								</tr>
							</thead>
							<tbody>
								{users.map((el, ind) => {
									return (
										<tr key={ind}>
											<td className="tdx">{el.first_name}</td>
											<td className="tdx">{el.last_name}</td>
											<td className="tdx">{el.phone}</td>
											<td className="tdx">{el.email_id}</td>
											<td className="tdx">
												<button
													style={buttons.button}
													className="defaultButtonHover1"
													onClick={() => {
														window.location.href = `/view-profile?id=${el.email_id}`;
													}}
												>
													View Profile
												</button>
											</td>
											<td className="tdx">
												<button
													style={{
														...buttons.button,
														background: !checkIsMyIntern(el.email_id) && 'gray',
														cursor: checkIsMyIntern(el.email_id)
															? 'pointer'
															: 'default',
													}}
													className="defaultButtonHover1"
													onClick={() => {
														var axios = require('axios');
														var config = {
															method: 'delete',
															url: `${host.host}/unassign-intern-to-project?intern_id=${el.email_id}`,

															headers: {
																Credentials: `Bearer ${window.localStorage.getItem(
																	'dbisToken'
																)}`,
															},
														};
														axios(config)
															.then((res) => {
																console.log(res.data);
																getAllUsers();
															})
															.catch((err) => console.log(err));
													}}
													disabled={!checkIsMyIntern(el.email_id)}
												>
													Remove
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
				<div>
					No Interns find working on this project under you. <br /> Please
					Assign Few!
				</div>
			)}
		</div>
	);
};

export default ViewProjectInterns;
