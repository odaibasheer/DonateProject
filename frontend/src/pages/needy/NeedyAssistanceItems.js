/* eslint-disable react-hooks/exhaustive-deps */
import {
    Card,
    Col,
    Row,
    UncontrolledDropdown,
    Badge,
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { Archive, ChevronDown, FileText, MoreVertical, Trash2 } from "react-feather";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    useDeleteAssistanceMutation,
    useGetAssistancesQuery,
} from "../../redux/api/assistanceAPI";

const NeedyAssistanceItems = () => {
    const navigate = useNavigate();
    const [deleteAssistance] = useDeleteAssistanceMutation();
    const { data: assistanceItems, refetch, isLoading } = useGetAssistancesQuery();
    const [selectedId, setSelectedId] = useState(null);
    const [modalDeleteVisibility, setModalDeleteVisibility] = useState(false);

    useEffect(() => {
        refetch();
    }, []); // Empty dependency array to avoid infinite loops

    const toggleDeleteModal = (id) => {
        setSelectedId(id);
        setModalDeleteVisibility(!modalDeleteVisibility);
    };

    const renderDocument = (file) => {
        if (!file) {
            return (
                <Badge color="light" className="p-2" pill>
                    No Document
                </Badge>
            );
        }
    
        return (
            <a href={file} target="_blank" rel="noopener noreferrer" className="text-primary d-flex align-items-center">
                <FileText size={16} className="me-1" />
                Document
            </a>
        );
    };

    const renderBadge = (value) => {
        const badgeColors = {
            Pending: "warning",
            Approved: "success",
            Declined: "danger",
        };
        return (
            <Badge color={badgeColors[value] || "secondary"} className="p-2" pill>
                {value}
            </Badge>
        );
    };

    const columns = [
        {
            name: "Supporting Document",
            width: "200px",
            cell: (row) => renderDocument(row.supporting_document),
        },
        {
            name: "Type",
            selector: (row) => row.type,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) =>
                row.description?.length > 30
                    ? `${row.description.substring(0, 30)}...`
                    : row.description,
            sortable: true,
            grow: 2,
        },
        {
            name: "Status",
            cell: (row) => renderBadge(row.status),
            sortable: true,
        },
        {
            name: "Created By",
            selector: (row) => row.createdBy?.username,
            sortable: true,
        },
        {
            name: "Actions",
            width: "150px",
            cell: (row) => (
                <UncontrolledDropdown>
                    <DropdownToggle tag="div" className="btn btn-sm">
                        <MoreVertical size={14} className="cursor-pointer action-btn" />
                    </DropdownToggle>
                    <DropdownMenu end container="body">
                        <DropdownItem
                            className="w-100"
                            onClick={() =>
                                navigate(`/needy/assistance-items/item-update/${row._id}`)
                            }
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

    const handleDeleteAssistance = async () => {
        try {
            if (selectedId) {
                await deleteAssistance(selectedId).unwrap();
                toast.success("Assistance deleted successfully");
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
                    <h3 className="mb-3">Assistance Item Management</h3>
                    <a
                        href="/needy/assistance-items/item-create"
                        className="btn btn-orange"
                    >
                        Create Assistance
                    </a>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <DataTable
                            title="Assistance Items"
                            data={assistanceItems || []}
                            responsive
                            className="react-dataTable"
                            noHeader
                            pagination
                            paginationRowsPerPageOptions={[10, 20, 50]}
                            columns={columns}
                            sortIcon={<ChevronDown />}
                            highlightOnHover
                            progressPending={isLoading}
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
                    Are you sure you want to delete this assistance item?
                </ModalBody>
                <ModalFooter>
                    <Button color="danger" onClick={handleDeleteAssistance}>
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

export default NeedyAssistanceItems;
