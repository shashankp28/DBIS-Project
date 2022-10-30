import { InputLabel, MenuItem, Select, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import buttons from '../../component/buttons';
import host from '../../data/host';
import getDataFromToken from '../../utils/getDataFromJWT';

const InternCompleted = () => {
	const [myInterns, setMyInterns] = useState([]);
	const [intern_id, setInternId] = useState();
	const [end_date, setEndDate] = useState();
	const [score, setScore] = useState();
	const [description, setDescription] = useState();
	const [err, setIsErr] = useState('');
	const [isSubmit, setIsSubmit] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [error, setIsError] = useState('');
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
	useEffect(() => {
		if (isSuccess) {
			setTimeout(() => {
				window.history.go(-1);
			}, 2000);
		}
	}, [isSuccess]);
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
		getMyInterns();
	}, []);
	useEffect(() => {
		if (!intern_id) {
			setIsErr('Please select intern');
		} else {
			setIsErr('');
		}
	}, [err, intern_id]);
	const handleSubmit = (e) => {
		e.preventDefault();
		setIsSubmit(true);
		if (err !== '') {
			return;
		}
		var axios = require('axios');
		var data = {
			email_id: intern_id,
			score: parseInt(score),
			end_date,
			performance_desc: description,
		};
		var config = {
			method: 'post',
			url: `${host.host}/intern-completed`,
			data,
			headers: {
				Credentials: `Bearer ${window.localStorage.getItem('dbisToken')}`,
			},
		};

		axios(config)
			.then((res) => {
				console.log(res.data);
				setIsSuccess(true);
				setIsError('');
			})
			.catch((err) => {
				console.log(err);
				setIsError(err.response.data.detail);
				setIsSuccess(false);
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
					}}
				>
					Mark completed
				</h1>
				<form
					style={{
						display: 'flex',
						flexDirection: 'column',
						alignItems: 'center',
						width: '100%',
					}}
					onSubmit={handleSubmit}
				>
					<InputLabel id="demo-simple-select-label">Intern Id</InputLabel>
					<Select
						labelId="demo-simple-select-label"
						id="demo-simple-select"
						value={intern_id}
						// label="Gender"
						required
						onChange={(evt) => setInternId(evt.target.value)}
						style={{ width: '80%' }}
					>
						{myInterns.map((el, ind) => (
							<MenuItem value={el.email_id}>
								{el.first_name} {el.last_name} ({el.email_id})
							</MenuItem>
						))}
					</Select>
					<br />

					<TextField
						id="outlined-basic"
						label="End Date"
						name="email"
						variant="outlined"
						type="date"
						required
						value={end_date}
						onChange={(evt) => setEndDate(evt.target.value)}
						style={{ width: '80%' }}
					/>
					<br />
					<TextField
						id="outlined-basic"
						label="Score"
						name="email"
						variant="outlined"
						type="number"
						required
						value={score}
						onChange={(evt) => setScore(evt.target.value)}
						style={{ width: '80%' }}
					/>
					<br />
					<TextField
						id="outlined-basic"
						label="Performance Description"
						name="email"
						variant="outlined"
						type="text"
						required
						value={description}
						onChange={(evt) => setDescription(evt.target.value)}
						style={{ width: '80%' }}
					/>
					<br />
					<button style={buttons.button} className="defaultButtonHover1">
						Submit
					</button>
					<br />
				</form>
				{isSubmit && <div style={{ color: 'red' }}>{err}</div>}
				{error && <div style={{ color: 'red' }}>{error}</div>}
				{isSuccess && (
					<div style={{ color: 'lightseagreen' }}>
						Intern completed Successfully
					</div>
				)}
			</div>
		</div>
	);
};

export default InternCompleted;
