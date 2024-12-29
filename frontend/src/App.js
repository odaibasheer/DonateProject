import React, { Suspense } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RequiredUser from './components/RequiredUser';
import AdminLogin from './pages/auth/AdminLogin';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Layout from './components/Layout';
import { getHomeRouteForLoggedInUser, getUserData } from './utils/Utils';
import DonorRegister from './pages/auth/DonorRegister';
import NeedyRegister from './pages/auth/NeedyRegister';
import VolunteerRegister from './pages/auth/VolunteerRegister';

const App = () => {
    const getHomeRoute = () => {
        const user = getUserData()
        if (user) {
            return <Navigate to={getHomeRouteForLoggedInUser(user.role)} replace />;
        } else {
            return <Navigate to="/login" replace />;
        }
    }

    return (
        <Suspense fallback={null}>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={getHomeRoute()} />
                    <Route element={<RequiredUser allowedRoles={['Donor']} />}>

                    </Route>
                    <Route element={<RequiredUser allowedRoles={['Needy']} />}>

                    </Route>
                    <Route element={<RequiredUser allowedRoles={['Volunteer']} />}>

                    </Route>
                    <Route element={<RequiredUser allowedRoles={['Admin']} />}>

                    </Route>
                    <Route path="admin/login" element={<AdminLogin />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                    <Route path="donor-register" element={<DonorRegister />} />
                    <Route path="needy-register" element={<NeedyRegister />} />
                    <Route path="volunteer-register" element={<VolunteerRegister />} />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default App;
