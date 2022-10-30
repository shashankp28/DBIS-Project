import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import host from '../data/host';
import getDataFromToken from '../utils/getDataFromJWT';
const classes = {
	button: {
		border: 'none',
		borderRadius: '100px',
		width: '150px',
		height: '55px',
		backgroundColor: '#fa2d64',
		color: '#ffffff',
		fontStyle: 'normal',
		fontFamily: 'Inter',
		fontWeight: '600',
		textAlign: 'center',
		fontSize: '26px',
		cursor: 'pointer',
	},
	fontname: {
		fontFamily: 'Inter',
	},
};
const SignIn = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [token, setToken] = useState(window.localStorage.getItem('dbisToken'));
	const [userId, setUserId] = useState('');
	useEffect(() => {
		if (token) {
			var user = getDataFromToken(token);
			if (user.isExp) {
				window.location = '/signin';
			}
			if (user.role === '1') {
				window.location.href = '/admin';
			} else if (user.role === '2') {
				window.location.href = '/employee';
			} else if (user.role === '3') {
				window.location.href = '/intern';
			} else {
				window.location.href = '/wait';
			}
			setUserId(user.email_id);
		}
	}, [token]);

	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('adf');
		const data = {
			email_id: email,
			password: password,
		};
		var axios = require('axios');
		var config = {
			method: 'post',
			url: `${host.host}/login`,
			data: data,
		};
		axios(config)
			.then(function (response) {
				console.log(JSON.stringify(response.data.access_token));
				if (response.status === 200) {
					console.log('success');
					window.localStorage.setItem('dbisToken', response.data.access_token);
					window.location.href = '/profile';
				}
				console.log(JSON.stringify(response.data));
			})
			.catch((err) => {
				console.log(err);
			});
	};

	return (
		<div
			style={{
				height: '100vh',
				width: '100vw',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
			}}
		>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-evenly',
					alignItems: 'center',
					flexDirection: 'column',
					width: '500px',
					boxShadow: '0px 0px 15px -1px rgba(0,0,0,0.74)',
					borderRadius: '12px',
				}}
			>
				<h1
					style={{
						fontSize: '2em',
						fontWeight: 'bold',
						...classes.fontname,
					}}
				>
					SignIn
				</h1>
				<form
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						width: '100%',
						...classes.fontname,
					}}
					onSubmit={handleSubmit}
				>
					<TextField
						id="outlined-basic"
						label="Email"
						name="email"
						variant="outlined"
						type="email"
						required
						value={email}
						onChange={(evt) => setEmail(evt.target.value)}
						style={{ width: '80%', ...classes.fontname }}
					/>
					<br />
					<TextField
						id="outlined-basic"
						label="Password"
						name="email"
						variant="outlined"
						type="password"
						required
						value={password}
						onChange={(evt) => setPassword(evt.target.value)}
						style={{ width: '80%', ...classes.fontname }}
					/>
					<br />
					<button style={classes.button} className="defaultButtonHover1">
						SignIn
					</button>
					<p>
						Don't have account? <a href="/signup">Create here.</a>
					</p>
					<br />
				</form>
			</div>
		</div>
	);
};

export default SignIn;
