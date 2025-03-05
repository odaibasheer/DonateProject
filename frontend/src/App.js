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
import AdminDashboard from './pages/admin/AdminDashboard';
import DonorDashboard from './pages/donor/DonorDashboard';
import NeedyDashboard from './pages/needy/NeedyDashboard';
import DonationItems from './pages/donor/DonationItems';
import DonationItemCreate from './pages/donor/DonationItemCreate';
import DonationItemUpdate from './pages/donor/DonationItemUpdate';
import NeedyAssistanceItems from './pages/needy/NeedyAssistanceItems';
import NeedyAssistanceItemCreate from './pages/needy/NeedyAssistanceItemCreate';
import NeedyAssistanceItemUpdate from './pages/needy/NeedyAssistanceItemUpdate';
import NeedyMyAssistanceItems from './pages/needy/NeedyMyAssistanceItems';
import AdminUser from './pages/admin/AdminUser';
import AdminUserUpdate from './pages/admin/AdminUserUpdate';
import AdminUserCreate from './pages/admin/AdminUserCreate';
import VolunteerProfile from './pages/volunteer/VolunteerProfile';
import VolunteerTasks from './pages/volunteer/VolunteerTasks';
import AdminInventory from './pages/admin/AdminInventory';
import AdminShipping from './pages/admin/AdminShipping';
import AdminShippingCreate from './pages/admin/AdminShippingCreate';
import AdminShippingUpdate from './pages/admin/AdminShippingUpdate';
import AdminSchedule from './pages/admin/AdminSchedule';

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
                        <Route path="donor/dashboard" element={<DonorDashboard />} />
                        <Route path="donor/donation-items" element={<DonationItems />} />
                        <Route path="donor/donation-items/item-create" element={<DonationItemCreate />} />
                        <Route path="donor/donation-items/item-update/:id" element={<DonationItemUpdate />} />
                    </Route>
                    <Route element={<RequiredUser allowedRoles={['Needy']} />}>
                        <Route path="needy/dashboard" element={<NeedyDashboard />} />
                        <Route path="needy/assistance-items" element={<NeedyAssistanceItems />} />
                        <Route path="needy/assistance-items/item-create" element={<NeedyAssistanceItemCreate />} />
                        <Route path="needy/assistance-items/item-update/:id" element={<NeedyAssistanceItemUpdate />} />
                        <Route path="needy/my-assistance-items" element={<NeedyMyAssistanceItems />} />
                    </Route>
                    <Route element={<RequiredUser allowedRoles={['Volunteer']} />}>
                        <Route path="volunteer/tasks" element={<VolunteerTasks />} />
                        <Route path="volunteer/profile" element={<VolunteerProfile />} />
                    </Route>
                    <Route element={<RequiredUser allowedRoles={['Admin']} />}>
                        <Route path="admin/dashboard" element={<AdminDashboard />} />
                        <Route path="admin/users" element={<AdminUser />} />
                        <Route path="admin/shipping" element={<AdminShipping />} />
                        <Route path="admin/shipping/track-shipping" element={<AdminShippingCreate />} />
                        <Route path="admin/shipping/update-shipping/:id" element={<AdminShippingUpdate />} />
                        <Route path="admin/users/create-user" element={<AdminUserCreate />} />
                        <Route path="admin/users/update-user/:id" element={<AdminUserUpdate />} />
                        <Route path="admin/inventory" element={<AdminInventory />} />
                        <Route path="admin/schedule" element={<AdminSchedule />} />
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
