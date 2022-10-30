import React, { useEffect, useState } from 'react';
import '../../App.css';
import buttons from '../../component/buttons';
import host from '../../data/host';
import getDataFromToken from '../../utils/getDataFromJWT';

// var users = [];
const AllMentorsWithStudents = () => {
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
	const [users, setUsers] = useState([]);

	const assignUser = () => {
		var axios = require('axios');
		var config = {
			method: 'get',
			url: `${host.host}/mentor`,
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
					<h2>List of all mentors with their interns</h2>
					{users.length > 0 && (
						<table
							className="overflow-scroll"
							style={{ width: '100%', textAlign: 'center' }}
						>
							<thead>
								<tr>
									<th className="thx">Mentor Email</th>
									<th className="thx">Mentor Name </th>
									<th className="thx">Intern Email</th>
									<th className="thx">Intern Name</th>
									<th className="thx">Intern Contact</th>
								</tr>
							</thead>
							<tbody>
								{users.map((el, ind) => {
									return (
										<tr key={ind}>
											<td className="tdx">{el.mentor.email_id}</td>
											<td className="tdx">
												{el.mentor.first_name} {el.mentor.last_name}
											</td>
											<td className="tdx">{el.intern.email_id}</td>
											<td className="tdx">
												{el.intern.first_name} {el.intern.last_name}
											</td>
											<td className="tdx">{el.intern.phone}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					)}
				</div>
			) : (
				<div>No Interns found please Hire New!</div>
			)}
		</div>
	);
};

export default AllMentorsWithStudents;
