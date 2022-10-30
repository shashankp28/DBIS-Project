import { Grid } from '@mui/material';
import { Box } from '@mui/system';
import React, { useEffect, useState } from 'react';
import host from '../../data/host';
import getDataFromToken from '../../utils/getDataFromJWT';

const EmployeeScreen = () => {
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
	var actions = [
		{
			title: 'Add Project',
			description: 'Add Project',
			href: '/add-project',
		},
		{
			title: 'Assign Project',
			description: 'Assign Project',
			href: '/assign-project',
		},
		{
			title: 'Get Project',
			description: 'Get Project',
			href: '/get-projects',
		},
		{
			title: 'Mark Intern Completed',
			description: 'Mark Intern Completed',
			href: '/intern-completed',
		},
		{
			title: 'View Profile',
			description: 'View Your Profile',
			href: `/view-profile?id=${userId}`,
		},
	];
	return (
		<div
			style={{
				height: '100vh',
				width: '100vw',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				flexDirection: 'column',
			}}
		>
			<h2>Welcome to Employee screen</h2>
			<Box
				sx={{ flexGrow: 1 }}
				direction="row"
				justifyContent="space-evenly"
				alignItems="center"
			>
				<Grid
					container
					// spacing={{ xs: 2, md: 3 }}
					columns={{ xs: 4, sm: 8, md: 12 }}
					direction="row"
					justifyContent="space-evenly"
					alignItems="center"
					// columnSpacing={12}
				>
					{actions.map((el, index) => (
						<Grid
							item
							xs={6}
							sm={4}
							md={2}
							key={index}
							style={{
								height: '250px',
								background:
									'linear-gradient(to right, hsla(14, 93%, 53%, 1) 0%, #fa2d64  100%, #9bd9e8 100%) repeat scroll 0 0',
								margin: '10px',
								borderRadius: '12px',
								cursor: 'pointer',
								transform: 'revert-layer',
								color: 'white',
								display: 'flex',
								// justifyContent: 'center',
								alignItems: 'center',
								flexDirection: 'column',
							}}
							onClick={() => {
								window.location.href = `${el.href}`;
							}}
						>
							<h2 style={{ color: '#751919', textDecoration: 'underline' }}>
								{el.title}
							</h2>
							<div style={{ width: '82%' }}>
								<p style={{ textAlign: 'center', fontSize: '21px' }}>
									{el.description}
								</p>
							</div>
						</Grid>
					))}
					<Grid
						item
						xs={6}
						sm={4}
						md={2}
						style={{
							height: '250px',
							background:
								'linear-gradient(to right, hsla(14, 93%, 53%, 1) 0%, #fa2d64  100%, #9bd9e8 100%) repeat scroll 0 0',
							margin: '10px',
							borderRadius: '12px',
							cursor: 'pointer',
							transform: 'revert-layer',
							color: 'white',
							display: 'flex',
							// justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column',
						}}
						onClick={() => {
							if (window.confirm('Are you sure to delete your profile')) {
								var axios = require('axios');
								var config = {
									method: 'delete',
									url: `${host.host}/profile`,
									headers: {
										Credentials: `Bearer ${window.localStorage.getItem(
											'dbisToken'
										)}`,
									},
								};
								axios(config)
									.then((res) => {
										console.log(res.data);
										window.location = '/signup';
									})
									.catch((err) => console.log(err));
							}
						}}
					>
						<h2 style={{ color: '#751919', textDecoration: 'underline' }}>
							Delete Profile
						</h2>
						<div style={{ width: '82%' }}>
							<p style={{ textAlign: 'center', fontSize: '21px' }}>
								Delete Profile
							</p>
						</div>
					</Grid>
					<Grid
						item
						xs={6}
						sm={4}
						md={2}
						style={{
							height: '250px',
							background:
								'linear-gradient(to right, hsla(14, 93%, 53%, 1) 0%, #fa2d64  100%, #9bd9e8 100%) repeat scroll 0 0',
							margin: '10px',
							borderRadius: '12px',
							cursor: 'pointer',
							transform: 'revert-layer',
							color: 'white',
							display: 'flex',
							// justifyContent: 'center',
							alignItems: 'center',
							flexDirection: 'column',
						}}
						onClick={() => {
							if (window.confirm('Are you sure to logout')) {
								window.localStorage.removeItem('dbisToken');
								window.location = '/signin';
							}
						}}
					>
						<h2 style={{ color: '#751919', textDecoration: 'underline' }}>
							Logout
						</h2>
						<div style={{ width: '82%' }}>
							<p style={{ textAlign: 'center', fontSize: '21px' }}>
								Logout here
							</p>
						</div>
					</Grid>
				</Grid>
			</Box>
		</div>
	);
};

export default EmployeeScreen;
