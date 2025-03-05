/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import {
    Collapse,
    Navbar,
    NavbarBrand,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from "reactstrap";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import userImg from '../assets/images/user.png';
import logoImg from '../assets/images/logo.png';
import { toast } from 'react-toastify';
import { useLogoutUserMutation } from "../redux/api/authAPI";

const Header = () => {
    const user = useSelector((state) => state.userState.user);
    const [isOpen, setIsOpen] = useState(false);
    const [logoutUser, { isLoading, isSuccess, error, isError }] = useLogoutUserMutation();
    const navigate = useNavigate();
    const toggle = () => setIsOpen(!isOpen);

    const mobileToggle = () => {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            setIsOpen(!isOpen);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            window.location.href = '/login';
        }

        if (isError) {
            const errorData = error?.data?.error;
            if (Array.isArray(errorData)) {
                errorData.forEach((el) =>
                    toast.error(el.message, {
                        position: 'top-right',
                    })
                );
            } else {
                toast.error(error?.data?.message, {
                    position: 'top-right',
                });
            }
        }
    }, [isLoading, isSuccess, isError]);

    const onLogoutHandler = () => {
        logoutUser();
    };

    return (
        <header>
            <div className="container">
                <Navbar expand="md" className="navbar-light">
                    <NavbarBrand
                        href={
                            user
                                ? user.role === 'Admin'
                                    ? '/admin/dashboard'
                                    : user.role === 'Donor'
                                        ? '/donor/dashboard'
                                        : user.role === 'Needy'
                                            ? '/needy/dashboard'
                                            : '/volunteer/profile'
                                : '/'
                        }
                    >
                        <img
                            src={logoImg}
                            alt="Donation"
                            className="logo-image"
                        />
                        <span className="mx-3 text-white fw-bold">Donation</span>
                    </NavbarBrand>

                    <NavbarToggler onClick={toggle} className="ms-auto" style={{ backgroundColor: 'white', borderColor: 'white' }} />
                    <Collapse isOpen={isOpen} navbar>
                        {!user && (
                            <Nav className="ms-auto" navbar>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/register'); mobileToggle(); }}>
                                        Register
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/login'); mobileToggle(); }}>
                                        Login
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        )}
                        {user && user.role === 'Donor' && (
                            <Nav className="ms-auto" navbar>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/donor/dashboard'); mobileToggle(); }}>
                                        Dashboard
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/donor/donation-items'); mobileToggle(); }}>
                                        Donation Items
                                    </NavLink>
                                </NavItem>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        <img src={userImg} alt="user" className="user-img" />
                                    </DropdownToggle>
                                    <DropdownMenu end>
                                        <DropdownItem onClick={onLogoutHandler}>Log out</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                        )}
                        {user && user.role === 'Needy' && (
                            <Nav className="ms-auto" navbar>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/needy/dashboard'); mobileToggle(); }}>
                                        Dashboard
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/needy/assistance-items'); mobileToggle(); }}>
                                        Requests
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/needy/my-assistance-items'); mobileToggle(); }}>
                                        My Items
                                    </NavLink>
                                </NavItem>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        <img src={userImg} alt="user" className="user-img" />
                                    </DropdownToggle>
                                    <DropdownMenu end>
                                        <DropdownItem onClick={onLogoutHandler}>Log out</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                        )}
                        {user && user.role === 'Volunteer' && (
                            <Nav className="ms-auto" navbar>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/volunteer/tasks'); mobileToggle(); }}>
                                        Tasks
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/volunteer/profile'); mobileToggle(); }}>
                                        Profile
                                    </NavLink>
                                </NavItem>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        <img src={userImg} alt="user" className="user-img" />
                                    </DropdownToggle>
                                    <DropdownMenu end>
                                        <DropdownItem onClick={onLogoutHandler}>Log out</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                        )}
                        {user && user.role === 'Admin' && (
                            <Nav className="ms-auto" navbar>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/admin/inventory'); mobileToggle(); }}>
                                        Inventory
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/admin/requests'); mobileToggle(); }}>
                                        Requests
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/admin/shipping'); mobileToggle(); }}>
                                        Shipping
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/admin/users'); mobileToggle(); }}>
                                        Users
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/admin/schedule'); mobileToggle(); }}>
                                        Schedule
                                    </NavLink>
                                </NavItem>
                                <NavItem className="nav-item-responsive">
                                    <NavLink onClick={() => { navigate('/admin/report'); mobileToggle(); }}>
                                        Report
                                    </NavLink>
                                </NavItem>
                                <UncontrolledDropdown nav inNavbar>
                                    <DropdownToggle nav caret>
                                        <img src={userImg} alt="user" className="user-img" />
                                    </DropdownToggle>
                                    <DropdownMenu end>
                                        <DropdownItem onClick={onLogoutHandler}>Log out</DropdownItem>
                                    </DropdownMenu>
                                </UncontrolledDropdown>
                            </Nav>
                        )}
                    </Collapse>
                </Navbar>
            </div>
        </header>
    );
};

export default Header;
