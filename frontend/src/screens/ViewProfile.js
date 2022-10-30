import { InputLabel, MenuItem, Select, TextField } from '@mui/material';
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
const ViewProfile = () => {
	const [firstName, setFirstName] = useState('');
	const [middleName, setMiddleName] = useState('');
	const [lastName, setLastName] = useState('');
	const [phone, setPhone] = useState('');
	const [dob, setDob] = useState('');
	const [addressFirstLine, setAddressFirstLine] = useState('');
	const [addressSecondLine, setAddressSecondLine] = useState('');
	const [zipcode, setZipcode] = useState(null);
	const [country, setCountry] = useState('');
	const [gender, setGender] = useState('male');
	const [appliedFor, setAppliedFor] = useState('intern');
	const [university, setUniversity] = useState(0);
	const [pathToResume, setPathToResume] = useState(null);
	const [universityCity, setUniversityCity] = useState('');
	const [universityName, setUniversityName] = useState('');
	const [universityCountry, setUniversityCountry] = useState('');
	const [allUniversities, setAllUniversities] = useState([]);
	const [cpi, setCpi] = useState(null);
	const [passingYear, setPassingYear] = useState(null);
	const [err, setErr] = useState('');
	const [isSubmitPressed, setIsSubmitPressed] = useState(false);
	const [token, setToken] = useState(window.localStorage.getItem('dbisToken'));
	const [isSuccess, setIsSuccess] = useState(false);
	const [isEditable, setIsEditable] = useState(false);
	useEffect(() => {}, [token]);

	useEffect(() => {
		if (!token) {
			window.location = '/signin';
		}
		var user = getDataFromToken(token);
		if (user.isExp) {
			window.location = '/signin';
		}
		var url = new URL(window.location.href);
		setIsEditable(url.searchParams.get('id') === user.email_id);

		var config = {
			method: 'get',
			url: `${host.host}/profile-by-id?email_id=${url.searchParams.get('id')}`,
			headers: {
				Credentials: `Bearer ${window.localStorage.getItem('dbisToken')}`,
			},
		};

		var axios = require('axios');
		axios(config)
			.then((res) => {
				var data = res.data;
				setFirstName(data.first_name);
				setMiddleName(data.middle_name);
				setLastName(data.last_name);
				setDob(data.dob);
				setAddressFirstLine(data.address_first_line);
				setAddressSecondLine(data.address_second_line);
				setZipcode(`${data.zip_code}`);
				setCountry(data.country);
				setGender(data.gender);
				setUniversity(data.university_id);
				setUniversityName(data.university_name);
				setUniversityCity(data.uni_city);
				setUniversityCountry(data.uni_country);
				setCpi(`${data.cpi}`);
				setPassingYear(`${data.passing_year}`);
				setPhone(data.phone);
				setAppliedFor(data.applied_for);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [token]);
	useEffect(() => {
		console.log(passingYear);
	}, [passingYear]);

	useEffect(() => {
		if (university === 0) {
			setErr('Please Enter your university details');
		} else {
			setErr('');
			setIsSubmitPressed(false);
		}
	}, [university]);
	useEffect(() => {
		var axios = require('axios');

		// ! getting the list of all universities

		var config = {
			method: 'get',
			url: `${host.host}/university`,
		};
		axios(config)
			.then((res) => {
				// console.log(res.data);
				setAllUniversities(res.data);
			})
			.catch((err) => {
				console.log(err);
			});
	}, [token]);
	useEffect(() => {
		setTimeout(() => {
			setIsSuccess(false);
		}, 2000);
	}, [isSuccess]);
	const handleSubmit = (e) => {
		setIsSubmitPressed(true);
		e.preventDefault();
		console.log('submit');
		var data = {
			first_name: firstName,
			middle_name: middleName,
			last_name: lastName,
			dob,
			address_first_line: addressFirstLine,
			address_second_line: addressSecondLine,
			zip_code: parseInt(zipcode),
			country,
			gender,
			university_id: university,
			university_name: universityName,
			uni_city: universityCity,
			uni_country: universityCountry,
			cpi: parseFloat(cpi),
			passing_year: parseInt(passingYear),
			phone: phone,
			applied_for: appliedFor,
		};
		for (const key in data) {
			if (data[key] === '') {
				delete data[key];
			}
		}
		var resume = {
			file: pathToResume,
		};
		if (err !== '') {
			return;
		}

		var axios = require('axios');

		var config = {
			method: 'post',
			data: data,
			url: `${host.host}/profile`,
			headers: {
				// 'Content-Type': 'multipart/form-data',
				Credentials: `Bearer ${token}`,
			},
		};
		console.log(config);

		axios(config)
			.then((res) => {
				console.log(res.data);
				setIsSuccess(true);
				// if (res.status === 200) {
				// 	config = {
				// 		method: 'post',
				// 		data: resume,
				// 		url: `${host.host}/upload-resume`,
				// 		headers: {
				// 			'Content-Type': 'multipart/form-data',
				// 			Credentials: `Bearer ${token}`,
				// 		},
				// 	};
				// 	// ! will upload resume
				// 	axios(config)
				// 		.then((response) => {
				// 			if (res.status === 200) {
				// 				console.log(JSON.stringify(response.data));
				// 			}
				// 		})
				// 		.catch((err) => {
				// 			console.log(err);
				// 			console.warn('File not uploaded');
				// 		});
				// }
			})
			.catch((err) => {
				console.log(err);
				console.warn('Profile not updated');
				setIsSuccess(false);
			});
	};

	return (
		<div
			style={{
				// height: '100vh',
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
					width: '60vw',
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
					Profile details of {firstName}
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
					<>
						<TextField
							id="outlined-basic"
							label="First Name"
							name="firstName"
							variant="outlined"
							type="text"
							required
							value={firstName}
							onChange={(evt) => setFirstName(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						<TextField
							id="outlined-basic"
							label="Middle Name"
							name="middleName"
							variant="outlined"
							type="text"
							value={middleName}
							onChange={(evt) => setMiddleName(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						<TextField
							id="outlined-basic"
							label="Last Name"
							name="lastName"
							variant="outlined"
							type="text"
							required
							value={lastName}
							onChange={(evt) => setLastName(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						<TextField
							id="outlined-basic"
							label="Phone"
							name="phone"
							variant="outlined"
							type="tel"
							required
							value={phone}
							onChange={(evt) => setPhone(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						<TextField
							id="outlined-basic"
							label="Address First Line"
							name="addressFirstLine"
							variant="outlined"
							type="text"
							required
							value={addressFirstLine}
							onChange={(evt) => setAddressFirstLine(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						<TextField
							id="outlined-basic"
							label="Address Second Line"
							name="addressSecondLine"
							variant="outlined"
							type="text"
							value={addressSecondLine}
							onChange={(evt) => setAddressSecondLine(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						<TextField
							id="outlined-basic"
							label="Date Of Birth"
							name="dob"
							variant="outlined"
							type="date"
							required
							value={dob}
							onChange={(evt) => setDob(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						<TextField
							id="outlined-basic"
							label="Phone"
							name="phone"
							variant="outlined"
							type="tel"
							required
							value={zipcode}
							onChange={(evt) => setZipcode(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						<TextField
							id="outlined-basic"
							label="Country"
							name="country"
							variant="outlined"
							type="text"
							required
							value={country}
							onChange={(evt) => setCountry(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						<TextField
							id="outlined-basic"
							label="CPI"
							name="cpi"
							variant="outlined"
							type="number"
							required
							value={cpi}
							onChange={(evt) => setCpi(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						<TextField
							id="outlined-basic"
							label="Passing Year"
							name="year"
							variant="outlined"
							type="number"
							required
							value={passingYear}
							onChange={(evt) => setPassingYear(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						/>
						<br />
						{/* <InputLabel id="input-path-to-resume">Resume</InputLabel>
						<TextField
							labelId="input-path-to-resume"
							id="outlined-basic"
							// label="Gender"
							name="firstName"
							variant="outlined"
							type="file"
							required
							// value={pathToResume}
							onChange={(evt) => {
								var [file] = evt.target.files;
								setPathToResume(file);
							}}
							disabled={!isEditable}
							style={{ width: '80%', ...classes.fontname }}
						/>
						<br /> */}

						<InputLabel id="demo-simple-select-label">Gender</InputLabel>
						<Select
							labelId="demo-simple-select-label"
							id="demo-simple-select"
							value={gender}
							// label="Gender"
							required
							onChange={(evt) => setGender(evt.target.value)}
							style={{ width: '80%', ...classes.fontname }}
							disabled={!isEditable}
						>
							<MenuItem value={'male'}>Male</MenuItem>
							<MenuItem value={'female'}>Female</MenuItem>
							<MenuItem value={'others'}>Others</MenuItem>
						</Select>
						<br />
						<InputLabel id="input-appliedfor">Applied for</InputLabel>
						<Select
							labelId="input-appliedfor"
							id="demoinput-simple-select"
							value={appliedFor}
							required
							// label="Gender"
							onChange={(evt) => setAppliedFor(evt.target.value)}
							disabled={!isEditable}
							style={{ width: '80%', ...classes.fontname }}
						>
							<MenuItem value={'intern'}>Intern</MenuItem>
							<MenuItem value={'employee'}>Employee</MenuItem>
						</Select>
						<br />
					</>
					<InputLabel id="input-university">University</InputLabel>
					<Select
						labelId="input-university"
						id="demo-sisdfmple-select"
						value={university}
						// label="Gender"disabled={!isEditable}
						onChange={(evt) => setUniversity(evt.target.value)}
						disabled={!isEditable}
						style={{ width: '80%', ...classes.fontname }}
					>
						{allUniversities.map((el, ind) => (
							<MenuItem value={el.id}>{el.name}</MenuItem>
						))}
					</Select>
					{university === 1 && (
						<>
							<br />
							<TextField
								id="outlined-basic"
								label="Name of University"
								name="university"
								variant="outlined"
								type="text"
								required
								value={universityName}
								onChange={(evt) => setUniversityName(evt.target.value)}
								style={{ width: '80%', ...classes.fontname }}
								disabled={!isEditable}
							/>
							<br />
							<TextField
								id="outlined-basic"
								label="City of University"
								name="universityCity"
								variant="outlined"
								type="text"
								required
								value={universityCity}
								onChange={(evt) => setUniversityCity(evt.target.value)}
								style={{ width: '80%', ...classes.fontname }}
								disabled={!isEditable}
							/>
							<br />
							<TextField
								id="outlined-basic"
								label="University country"
								name="uniCountry"
								variant="outlined"
								type="text"
								required
								value={universityCountry}
								onChange={(evt) => setUniversityCountry(evt.target.value)}
								style={{ width: '80%', ...classes.fontname }}
								disabled={!isEditable}
							/>
						</>
					)}
					<br />

					{isEditable && (
						<button style={classes.button} className="defaultButtonHover1">
							Update profile
						</button>
					)}
				</form>
				{err && isSubmitPressed && <div style={{ color: 'red' }}> {err}</div>}
				{isSuccess && (
					<div style={{ color: 'lightseagreen' }}>
						<br />
						Profile updated Successfully
						<br />
						<br />
					</div>
				)}
			</div>
		</div>
	);
};

export default ViewProfile;
