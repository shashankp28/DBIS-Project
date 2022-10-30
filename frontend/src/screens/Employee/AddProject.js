import { TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import host from '../../data/host';
import getDataFromToken from '../../utils/getDataFromJWT';
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
const AddProject = () => {
	const [project_id, setProject_id] = useState('');
	const [topic, setTopic] = useState('');
	const [description, setDescription] = useState('');
	const [err, setErr] = useState('');
	const [isSuccess, setIsSuccess] = useState(false);

	const [token, setToken] = useState(window.localStorage.getItem('dbisToken'));
	const [userId, setUserId] = useState('');
	const [isPerm, setIsPerm] = useState(true);
	useEffect(() => {
		if (!token) {
			window.location = '/signin';
		}
		var user = getDataFromToken(token);
		if (user.isExp) {
			window.location = '/signin';
		}
		console.log(user.role);
		// if (user.role !== '1' || user.role !== '2') {
		// 	window.location.href = '/unauthorized';
		// }
		if (user.role === '1' || user.role === '2') {
			setIsPerm(true);
		} else {
			setIsPerm(false);
		}
		setUserId(user.email_id);
	}, [token]);
	useEffect(() => {
		if (!isPerm) {
			window.location.href = '/unauthorized';
		}
	}, [isPerm]);
	useEffect(() => {
		if (isSuccess) {
			setIsSuccess(true);
			setTimeout(() => {
				window.history.go(-1);
			}, 2000);
		} else {
			setIsSuccess(false);
		}
	}, [isSuccess]);
	const handleSubmit = (e) => {
		e.preventDefault();
		const data = {
			project_id,
			topic,
			description,
		};
		var axios = require('axios');
		var config = {
			method: 'post',
			url: `${host.host}/project`,
			data: data,
			headers: {
				Credentials: `Bearer ${localStorage.getItem('dbisToken')}`,
			},
		};
		console.log(config);
		axios(config)
			.then(function (response) {
				console.log(JSON.stringify(response.data));
				setErr('');
				setIsSuccess(true);
			})
			.catch((err) => {
				console.log(err.response);
				setIsSuccess(false);
				setErr(err.response.data.detail);
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
					Add New Project
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
						label="Project Id"
						name="email"
						variant="outlined"
						type="tel"
						required
						value={project_id}
						onChange={(evt) => setProject_id(evt.target.value)}
						style={{ width: '80%', ...classes.fontname }}
					/>
					<br />
					<TextField
						id="outlined-basic"
						label="Topic"
						name="email"
						variant="outlined"
						type="text"
						required
						value={topic}
						onChange={(evt) => setTopic(evt.target.value)}
						style={{ width: '80%', ...classes.fontname }}
					/>
					<br />
					<TextField
						id="outlined-basic"
						label="Description"
						name="email"
						variant="outlined"
						type="text"
						required
						value={description}
						onChange={(evt) => setDescription(evt.target.value)}
						style={{ width: '80%', ...classes.fontname }}
					/>
					<br />
					<button style={classes.button} className="defaultButtonHover1">
						Add Project
					</button>
					<br />
				</form>
				<div style={{ color: 'red' }}>{err}</div>
				{isSuccess && (
					<div style={{ color: 'lightseagreen' }}>
						Project Added Successfully
					</div>
				)}
			</div>
		</div>
	);
};

export default AddProject;
