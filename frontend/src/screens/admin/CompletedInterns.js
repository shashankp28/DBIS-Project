import React, { useEffect, useState } from 'react';
import '../../App.css';
import buttons from '../../component/buttons';
import host from '../../data/host';
import getDataFromToken from '../../utils/getDataFromJWT';

// var users = [];
const CompletedInterns = () => {
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
			url: `${host.host}/completed-interns`,
			headers: {
				Credentials: `Bearer ${window.localStorage.getItem('dbisToken')}`,
			},
		};

		axios(config)
			.then((res) => {
				setUsers(res.data);
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
					<h2>List of all completed Interns</h2>
					{users.length > 0 && (
						<table
							className="overflow-scroll"
							style={{ width: '100%', textAlign: 'center' }}
						>
							<thead>
								<tr>
									<th className="thx">Email Id</th>
									<th className="thx">Name </th>
									<th className="thx">End Date</th>
									<th className="thx">
										Score
										<br /> (out of 10)
									</th>
									<th className="thx">Performance</th>
								</tr>
							</thead>
							<tbody>
								{users.map((el, ind) => {
									return (
										<tr key={ind}>
											<td className="tdx">{el.email_id}</td>
											<td className="tdx">
												{el.details.first_name} {el.details.last_name}
											</td>
											<td className="tdx">{el.end_date}</td>

											<td className="tdx">{el.score}</td>
											<td className="tdx">{el.performance_desc}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>
			) : (
				<div>No interns completed yet</div>
			)}
		</div>
	);
};

export default CompletedInterns;
