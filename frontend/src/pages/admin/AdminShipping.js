/* eslint-disable react-hooks/exhaustive-deps */
import { Col, Row, Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge, Modal, ModalHeader, ModalFooter, Button, ModalBody } from "reactstrap";
import { useDeleteTaskMutation, useGetTasksQuery } from "../../redux/api/taskAPI";
import { useEffect, useState } from "react";
import DataTable from 'react-data-table-component';
import { Edit, ChevronDown, MoreVertical, Trash2 } from 'react-feather';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';

const AdminShipping = () => {
    const navigate = useNavigate();

    const [status, setStatus] = useState('');
    const [selectedId, setSelectedId] = useState(null);
    const [modalDeleteVisibility, setModalDeleteVisibility] = useState(false);

    const queryParams = {
        status: status,
    };

    const { data: shippings, refetch, isLoading } = useGetTasksQuery(queryParams);
    const [deleteTask] = useDeleteTaskMutation();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const toggleDeleteModal = (id = null) => {
        setSelectedId(id);
        setModalDeleteVisibility(!modalDeleteVisibility);
    };

    const handleDeleteTask = async () => {
        try {
            if (selectedId) {
                await deleteTask(selectedId).unwrap();
                toast.success('Shipping deleted successfully');
                refetch();
            }
        } catch (error) {
            toast.error(`${error.message || error.data.message}`);
        } finally {
            setModalDeleteVisibility(false);
        }
    };

    const renderBadge = (type, value) => {
        const badgeColors = {
            // Status badges
            Pending: 'info',
            'In Transit': 'warning',
            Delivered: 'success',

            // Urgency badges
            Low: 'success',
            Medium: 'warning',
            High: 'danger',
        };

        const defaultColor = 'secondary'; // Fallback color for unsupported values

        return (
            <Badge color={badgeColors[value] || defaultColor} className="px-3 py-2" pill>
                {value}
            </Badge>
        );
    };

    const columns = [
        {
            name: 'Title',
            selector: (row) => row.title,
            sortable: true,
        },
        {
            name: 'Type',
            selector: (row) => row.type,
            sortable: true,
        },
        {
            name: 'Location',
            selector: (row) => row.location,
            sortable: true,
        },
        {
            name: 'Assigned User',
            selector: (row) => row.assign?.username,
            sortable: true,
        },
        {
            name: 'Donation',
            selector: (row) => row.donation?.title,
            sortable: true,
        },
        {
            name: 'Assistance',
            selector: (row) => row.assistance?.title,
            sortable: true,
        },
        {
            name: 'Status',
            cell: (row) => renderBadge('status', row.status),
        },
        {
            name: 'Urgency',
            cell: (row) => renderBadge('urgency', row.urgency),
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
                                <DropdownItem className="w-100" onClick={() => navigate(`/admin/shipping/update-shipping/${row._id}`)}>
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
        <div className="main-view container">
            <Row>
                <Col>
                    <h3>Shipping and Logistics</h3>
                    <a href="/admin/shipping/track-shipping" className="btn btn-orange">
                        Track Shipping
                    </a>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <DataTable
                            title="Shippings"
                            data={shippings || []}
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
                    <Button color="danger" onClick={handleDeleteTask}>Delete</Button>
                    <Button color="secondary" onClick={() => toggleDeleteModal()} outline>No</Button>
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default AdminShipping;