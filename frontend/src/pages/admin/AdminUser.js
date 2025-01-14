/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import {
    Button,
    Row,
    Col,
    Card,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Badge,
    UncontrolledDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
} from 'reactstrap';
import DataTable from 'react-data-table-component';
import { toast } from 'react-toastify';
import Select from 'react-select';
import { useDeleteUserMutation, useGetUsersQuery } from '../../redux/api/userAPI';
import { Edit, ChevronDown, MoreVertical, Trash2 } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import FullScreenLoader from '../../components/FullScreenLoader';

const AdminUser = () => {
    const [status, setStatus] = useState('');
    const [role, setRole] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [modalDeleteVisibility, setModalDeleteVisibility] = useState(false);

    const navigate = useNavigate();

    const queryParams = {
        status: status,
        role: role
    };
    const { data: users, refetch, isLoading } = useGetUsersQuery(queryParams);
    const [deleteUser] = useDeleteUserMutation();

    useEffect(() => {
        refetch();
    }, [status, role, refetch]);

    const handleFilterChange = (filterKey, value) => {
        if (filterKey === 'role') setRole(value);
        if (filterKey === 'status') setStatus(value);
    };

    const toggleDeleteModal = (id = null) => {
        setSelectedId(id);
        setModalDeleteVisibility(!modalDeleteVisibility);
    };

    const handleDeleteUser = async () => {
        try {
            if (selectedId) {
                await deleteUser(selectedId).unwrap();
                toast.success('User deleted successfully');
                refetch();
            }
        } catch (error) {
            toast.error(`${error.message || error.data.message}`);
        } finally {
            setModalDeleteVisibility(false);
        }
    };

    const roleOptions = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Donor', label: 'Donor' },
        { value: 'Needy', label: 'Needy' },
        { value: 'Volunteer', label: 'Volunteer' },
    ];

    const renderBadge = (type, value) => {
        const badgeColors = {
            Admin: 'info',
            Donor: 'success',
            Needy: 'primary',
            Volunteer: 'warning',
        };
        return (
            <Badge color={badgeColors[value] || 'secondary'} className="px-3 py-2" pill>
                {value}
            </Badge>
        );
    };

    const columns = [
        {
            name: 'Username',
            selector: (row) => row.username,
            sortable: true,
        },
        {
            name: 'Email',
            selector: (row) => row.email,
            sortable: true,
        },
        {
            name: 'Role',
            cell: (row) => renderBadge('role', row.role),
        },
        {
            name: 'Phone',
            selector: (row) => row.phone,
            sortable: true,
        },
        {
            name: 'Address',
            selector: (row) => row.address,
            sortable: true,
        },
        {
            name: 'Age',
            selector: (row) => row.age,
            sortable: true,
        },
        {
            name: 'Socio Economic Status',
            selector: (row) => row.socio_economic_status,
            sortable: true,
        },
        {
            name: 'Skills',
            selector: (row) => row.skills,
            sortable: true,
        },
        {
            name: 'Availability',
            selector: (row) => row.availability,
            sortable: true,
        },
        {
            name: 'Actions',
            width: '120px',
            cell: (row) => (
                <>
                    {row.role !== 'Admin' && (
                        <UncontrolledDropdown>
                            <DropdownToggle tag="div" className="btn btn-sm">
                                <MoreVertical size={14} className="cursor-pointer action-btn" />
                            </DropdownToggle>
                            <DropdownMenu end container="body">
                                <DropdownItem className="w-100" onClick={() => navigate(`/admin/users/update-user/${row._id}`)}>
                                    <Edit size={14} className="mx-1" />
                                    <span className="align-middle mx-2">Edit</span>
                                </DropdownItem>
                                <DropdownItem onClick={() => toggleDeleteModal(row._id)}>
                                    <Trash2 size={14} className="mx-1" />
                                    <span className="align-middle mx-2">Delete</span>
                                </DropdownItem>
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    )}
                </>
            ),
        },
    ];

    return (
        <>
            {isLoading ? (
                <FullScreenLoader />
            ) : (
                <div className="container main-view">
                    <Row className="my-3">
                        <Col>
                            <h3>User Management</h3>
                            <a href="/admin/users/create-user" className="btn btn-orange">
                                Create User
                            </a>
                        </Col>
                    </Row>

                    <Row className="mb-3">
                        <Col md={4}>
                            <Select
                                options={roleOptions}
                                onChange={(e) => handleFilterChange('role', e?.value || '')}
                                placeholder="Filter by Role"
                                isClearable={true}
                            />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Card>
                                <DataTable
                                    title="Users"
                                    data={users || []}
                                    responsive
                                    className="react-dataTable"
                                    noHeader
                                    pagination
                                    paginationRowsPerPageOptions={[15, 30, 50, 100]}
                                    columns={columns}
                                    sortIcon={<ChevronDown />}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Modal isOpen={modalDeleteVisibility} toggle={() => toggleDeleteModal()}>
                        <ModalHeader toggle={() => toggleDeleteModal()}>Delete Confirmation</ModalHeader>
                        <ModalBody>Are you sure you want to delete?</ModalBody>
                        <ModalFooter>
                            <Button color="danger" onClick={handleDeleteUser}>Delete</Button>
                            <Button color="secondary" onClick={() => toggleDeleteModal()} outline>No</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            )}
        </>
    );
};

export default AdminUser;
