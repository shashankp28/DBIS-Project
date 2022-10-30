import { TextField } from '@mui/material';
import React, { useState } from 'react';
import host from '../data/host';
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
const Unauthorized = () => {
	const [files, setFile] = useState(null);
	const handleFile = (evt) => {
		var [file] = evt.target.files;
		setFile(file);
		console.log(file);
	};
	const handleSubmit = (e) => {
		e.preventDefault();
		console.log('adf');
		// var data = new FormData();
		// for (const file of files) {
		// 	data.append('file', file);
		// }
		var axios = require('axios');
		var config = {
			method: 'post',
			url: `${host.host}/uploadfile`,
			data: {
				file: files,
			},
			headers: {
				'Content-Type': 'multipart/form-data',
			},
		};
		axios(config)
			.then(function (response) {
				console.log(JSON.stringify(response.data));
				if (response.status === 200) {
					console.log('success');
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
				flexDirection: 'column',
			}}
		>
			<h1 style={{ color: 'red' }}>Route is not permitted.</h1>
			<h3>
				You are not authenticated to perform this action. Please login with
				appropriate Credentials to perform this action
			</h3>
			{/* <div
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
					Unauthorized
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
						type="file"
						required
						onChange={handleFile}
						style={{ width: '80%', ...classes.fontname }}
					/>

					<button style={classes.button} className="defaultButtonHover1">
						Unauthorized
					</button>
					<br />
				</form>
			</div> */}
		</div>
	);
};

export default Unauthorized;
