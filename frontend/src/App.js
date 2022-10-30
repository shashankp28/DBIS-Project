import AdminScreen from './screens/admin';
import './App.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './screens/SignUp';
import SignIn from './screens/SignIn';
import Register from './screens/Register';
import Unauthorized from './screens/Unauthorized';
import InternScreen from './screens/Intern';
import EmployeeScreen from './screens/Employee';
import AddIntern from './screens/admin/AddIntern';
import AddEmployee from './screens/admin/AddEmployee';
import AssignInternForm from './screens/admin/AssignInternForm';
import AssignEmployeeForm from './screens/admin/AssignEmployee';
import GetInterns from './screens/admin/GetInterns';
import GetEmployees from './screens/admin/GetEmployees';
import AddProject from './screens/Employee/AddProject';
import AssignProject from './screens/Employee/AssignProject';
import GetProjects from './screens/Employee/GetProjects';
import ViewProjectInterns from './screens/Employee/ViewProjectInterns';
import ViewProfile from './screens/ViewProfile';
import AllMentorsWithStudents from './screens/admin/AllMentorsWithInterns';
import CompletedInterns from './screens/admin/CompletedInterns';
import InternCompleted from './screens/Employee/InternCompleted';
import Wait from './screens/Wait';
const router = createBrowserRouter([
	{
		path: '/wait',
		element: <Wait />,
	},
	{
		path: '/unauthorized',
		element: <Unauthorized />,
	},
	{
		path: '/',
		element: <SignIn />,
	},
	{
		path: '/signin',
		element: <SignIn />,
	},
	{
		path: '/signup',
		element: <SignUp />,
	},
	{
		path: '/profile',
		element: <Register />,
	},
	{
		path: '/admin',
		element: <AdminScreen />,
	},
	{
		path: '/intern',
		element: <InternScreen />,
	},
	{
		path: '/employee',
		element: <EmployeeScreen />,
	},
	{
		path: '/add-intern',
		element: <AddIntern />,
	},
	{
		path: '/add-employee',
		element: <AddEmployee />,
	},
	{
		path: '/assign-intern',
		element: <AssignInternForm />,
	},
	{
		path: '/assign-employee',
		element: <AssignEmployeeForm />,
	},
	{
		path: '/get-interns',
		element: <GetInterns />,
	},
	{
		path: '/get-interns',
		element: <GetInterns />,
	},
	{
		path: '/get-employee',
		element: <GetEmployees />,
	},
	{
		path: '/add-project',
		element: <AddProject />,
	},
	{
		path: '/assign-project',
		element: <AssignProject />,
	},
	{
		path: '/get-projects',
		element: <GetProjects />,
	},
	{
		path: '/view-project-interns',
		element: <ViewProjectInterns />,
	},
	{
		path: '/view-profile',
		element: <ViewProfile />,
	},
	{
		path: '/all-mentor',
		element: <AllMentorsWithStudents />,
	},
	{
		path: '/completed-interns',
		element: <CompletedInterns />,
	},
	{
		path: '/intern-completed',
		element: <InternCompleted />,
	},
]);
function App() {
	return (
		<div className="App">
			<RouterProvider router={router} />
			{/* <AdminScreen /> */}
		</div>
	);
}

export default App;
