import { InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import host from '../../data/host';
import getDataFromToken from '../../utils/getDataFromJWT';
const classes = {
	button: {
		border: 'none',
		borderRadius: '100px',
		width: '250px',
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
const AssignEmployeeForm = () => {
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
	const [email, setEmail] = useState(
		new URL(window.location.href).searchParams.get('id')
	);
	const [stipend, setStipend] = useState(0);
	const [location, setLocation] = useState('1');
	const [allLocations, setAllLocations] = useState([]);
	const [isSuccess, setIsSuccess] = useState(false);
	const [err, setIsErr] = useState('');
	useEffect(() => {
		if (isSuccess) {
			setTimeout(() => {
				window.history.go(-1);
			}, 2000);
		} else {
			setIsSuccess(false);
		}
	}, [isSuccess]);
	useEffect(() => {
		var axios = require('axios');
		var config = {
			method: 'get',
			url: `${host.host}/location`,
		};
		axios(config)
			.then((res) => {
				setAllLocations(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, []);

	const handleSubmit = (e) => {
		e.preventDefault();
		var data = {
			email_id: email,
			salary: parseInt(stipend),
			location_id: location,
		};

		var config = {
			method: 'post',
			url: `${host.host}/employee`,
			data: data,
			headers: {
				Credentials: `Bearer ${localStorage.getItem('dbisToken')}`,
			},
		};

		var axios = require('axios');
		axios(config)
			.then((res) => {
				console.log(res.data);
				setIsSuccess(true);
				setIsErr('');
			})
			.catch((err) => {
				console.log(err);
				setIsSuccess(false);
				setIsErr('something went wrong');
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
					Assign Employee
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
						label="Salary"
						name="stipend"
						variant="outlined"
						type="number"
						required
						value={stipend}
						onChange={(evt) => setStipend(evt.target.value)}
						style={{ width: '80%', ...classes.fontname }}
					/>
					<br />
					<InputLabel id="input-university">Location</InputLabel>
					<Select
						labelId="input-university"
						id="demo-sisdfmple-select"
						value={location}
						// label="Gender"
						onChange={(evt) => setLocation(evt.target.value)}
						style={{ width: '80%', ...classes.fontname }}
					>
						{allLocations.map((el, ind) => (
							<MenuItem value={el.location_id}>
								{el.address}, {el.city}, {el.country}
							</MenuItem>
						))}
					</Select>
					<br />
					<button style={classes.button} className="defaultButtonHover1">
						Assign Employee
					</button>
					<br />
				</form>
				{isSuccess && (
					<div style={{ color: 'lightseagreen' }}>Assigned Successfully</div>
				)}
				{err && (
					<div style={{ color: 'red' }}>
						Something went wrong please try again later
					</div>
				)}
			</div>
		</div>
	);
};

export default AssignEmployeeForm;
