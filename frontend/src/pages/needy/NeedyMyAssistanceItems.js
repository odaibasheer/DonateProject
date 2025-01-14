/* eslint-disable react-hooks/exhaustive-deps */
import {
    Card,
    Col,
    Row,
    Badge,
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
} from "reactstrap";
import DataTable from "react-data-table-component";
import { toast } from "react-toastify";
import { ChevronDown, FileText } from "react-feather";
import { useEffect, useState } from "react";
import {
    useDeleteAssistanceMutation,
    useGetAssistancesQuery,
} from "../../redux/api/assistanceAPI";

const NeedyMyAssistanceItems = () => {
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
                    <h3 className="mb-3">My Assistances</h3>
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

export default NeedyMyAssistanceItems;
