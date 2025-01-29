/* eslint-disable react-hooks/exhaustive-deps */
import { Card, Col, Row, UncontrolledDropdown, Badge, DropdownToggle, DropdownMenu, DropdownItem, Modal, ModalHeader, ModalBody, ModalFooter, Button } from "reactstrap";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { Archive, ChevronDown, MoreVertical, Trash2 } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useDeleteItemMutation, useGetItemsQuery } from "../../redux/api/itemAPI";
import { useEffect, useState } from "react";

const DonationItems = () => {
    const navigate = useNavigate();
    const [deleteItem] = useDeleteItemMutation();
    const { data: items, refetch, isLoading } = useGetItemsQuery();
    const [selectedId, setSelectedId] = useState(null);
    const [modalDeleteVisibility, setModalDeleteVisibility] = useState(false);

    useEffect(() => {
        refetch();
    }, [refetch]); // Corrected dependency array

    const toggleDeleteModal = (id) => {
        setSelectedId(id);
        setModalDeleteVisibility(!modalDeleteVisibility);
    };

    const renderImage = (image) => (
        <img
            src={image}
            alt="Item"
            className="img-fluid"
            style={{ maxWidth: "50px", maxHeight: "50px" }}
        />
    );

    const renderBadge = (type, value) => {
        const badgeColors = {
            Available: 'success',
            Busy: 'primary',
        };
        return (
            <Badge color={badgeColors[value] || 'secondary'} className="p-2" pill>
                {value}
            </Badge>
        );
    };

    const columns = [
        {
            name: "",
            width: "100px",
            cell: (row) => renderImage(row.image),
        },
        {
            name: "Donation Type",
            width: "100px",
            selector: (row) => row.type,
            sortable: true,
        },
        {
            name: "Quantity",
            selector: (row) => row.quantity,
            sortable: true,
        },
        {
            name: 'Description',
            selector: (row) =>
                row.description.length > 30
                    ? `${row.description.substring(0, 30)}...`
                    : row.description,
            sortable: true,
            grow: 2,
        },
        {
            name: "CreatedBy",
            selector: (row) => row.createdBy?.username,
            sortable: true,
        },
        {
            name: 'Purpose',
            selector: (row) =>
                row.purpose.length > 30
                    ? `${row.purpose.substring(0, 30)}...`
                    : row.purpose,
            sortable: true,
            grow: 2,
        },
        {
            name: "Actions",
            width: "120px",
            cell: (row) => (
                <UncontrolledDropdown>
                    <DropdownToggle tag="div" className="btn btn-sm">
                        <MoreVertical size={14} className="cursor-pointer action-btn" />
                    </DropdownToggle>
                    <DropdownMenu end container="body">
                        <DropdownItem
                            className="w-100"
                            onClick={() => navigate(`/donor/donation-items/item-update/${row._id}`)}
                        >
                            <Archive size={14} className="mx-1" />
                            <span className="align-middle mx-2">Edit</span>
                        </DropdownItem>

                        <DropdownItem onClick={() => toggleDeleteModal(row._id)}>
                            <Trash2 size={14} className="mx-1" />
                            <span className="align-middle mx-2">Delete</span>
                        </DropdownItem>
                    </DropdownMenu>
                </UncontrolledDropdown>
            ),
        },
    ];

    const handleDeleteItem = async () => {
        try {
            if (selectedId) {
                await deleteItem(selectedId).unwrap();
                toast.success("Item deleted successfully");
                refetch();
            }
        } catch (error) {
            const errorMessage =
                error?.data?.message || "An unexpected error occurred.";
            toast.error(errorMessage);
        } finally {
            setModalDeleteVisibility(false);
        }
    };

    return (
        <div className="container main-view">
            <Row className="my-3">
                <Col>
                    <h3 className="mb-3">Donation Item Management</h3>
                    <a href="/donor/donation-items/item-create" className="btn btn-orange">
                        Create Item
                    </a>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <DataTable
                            title="Items"
                            data={items || []}
                            responsive
                            className="react-dataTable"
                            noHeader
                            pagination
                            paginationRowsPerPageOptions={[15, 30, 50, 100]}
                            columns={columns}
                            sortIcon={<ChevronDown />}
                            highlightOnHover
                            progressPending={isLoading} // Show loader while fetching
                        />
                    </Card>
                </Col>
            </Row>
            <Modal
                isOpen={modalDeleteVisibility}
                toggle={() => toggleDeleteModal()}
            >
                <ModalHeader toggle={() => toggleDeleteModal()}>
                    Delete Confirmation
                </ModalHeader>
                <ModalBody>
                    Are you sure you want to delete this item?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteItem}>
                        Delete
                    </Button>
                    <Button
                        color="secondary"
                        onClick={() => toggleDeleteModal()}
                        outline
                    >
                        Cancel
                    </Button>
                </ModalFooter>
            </Modal>
        </div>
    );
};

export default DonationItems;
