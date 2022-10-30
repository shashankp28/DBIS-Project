import { TextField } from '@mui/material';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import host from '../data/host';
import getDataFromToken from '../utils/getDataFromJWT';
const classes = {
	button: {
		border: 'none',
		borderRadius: '100px',
		width: '200px',
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
const SignUp = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [err, setErr] = useState('');

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

	const handleSubmit = (evt) => {
		evt.preventDefault();
		if (confirmPassword !== password) {
			setErr("Passwords didn't match");
			return;
		}
		setErr('');
		const data = {
			email_id: email,
			password: password,
			confirm_password: confirmPassword,
		};
		var config = {
			method: 'post',
			url: `${host.host}/register`,
			data: data,
		};
		axios(config)
			.then((res) => {
				console.log(JSON.stringify(res.data));
				if (res.status === 200) {
					window.localStorage.setItem('dbisToken', res.data.access_token);
					window.location.href = '/profile';
				}
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
					SignUp
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
					<TextField
						id="outlined-basic"
						label="Confirm Password"
						name="email"
						variant="outlined"
						type="password"
						required
						value={confirmPassword}
						onChange={(evt) => setConfirmPassword(evt.target.value)}
						style={{ width: '80%', ...classes.fontname }}
					/>
					<br />
					<button style={classes.button} className="defaultButtonHover1">
						Create Account
					</button>
					<p>
						Already have account? <a href="/signin">Login here.</a>
					</p>
					<br />
					{err && <div style={{ color: 'red' }}>{err}</div>}
				</form>
			</div>
		</div>
	);
};

export default SignUp;
