/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import classnames from "classnames";
import { useGetAssistanceQuery, useUpdateAssistanceStatusMutation } from "../../redux/api/assistanceAPI";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import FullScreenLoader from "../../components/FullScreenLoader";

const AdminRequestView = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    const { data: assistanceItem, isError, error, isLoading } = useGetAssistanceQuery(id);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [updateAssistanceStatus, { isLoading: isUpdating, isError: isUpdateError, error: updateError, isSuccess }] =
    useUpdateAssistanceStatusMutation();

    useEffect(() => {
        if (assistanceItem) {
            setValue("status", assistanceItem.status);
        }

        if (isError) {
            toast.error(error?.data?.message || "Error fetching assistance item.");
        }
    }, [assistanceItem, isError]);

    const onSubmit = async (formData) => {
        try {
            await updateAssistanceStatus({ id, assistance: { status: formData.status } });
        } catch (error) {
            toast.error("Error updating the status.");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Status updated successfully!");
            navigate("/admin/requests");
        }

        if (isUpdateError) {
            toast.error(updateError?.data?.message || "Error updating status.");
        }
    }, [isSuccess, isUpdateError]);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div className="container main-view">
            <Row className="mt-4">
                <Col>
                    <h2 className="text-center">Assistance Request Details</h2>
                </Col>
            </Row>
            <Card className="shadow-sm mt-4">
                <CardBody>
                    {assistanceItem && (
                        <div className="mb-4">
                            <Row>
                                <Col md={6}>
                                    <p className="mb-2">
                                        <strong>Type:</strong>{" "}
                                        <span className="text-muted">{assistanceItem.type}</span>
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p className="mb-2">
                                        <strong>Status:</strong>{" "}
                                        <span
                                            className={`badge ${
                                                assistanceItem.status === "Approved"
                                                    ? "bg-success"
                                                    : assistanceItem.status === "Declined"
                                                    ? "bg-danger"
                                                    : "bg-warning text-dark"
                                            }`}
                                        >
                                            {assistanceItem.status}
                                        </span>
                                    </p>
                                </Col>
                                <Col md={12}>
                                    <p className="mb-2">
                                        <strong>Description:</strong>{" "}
                                        <span className="text-muted">{assistanceItem.description}</span>
                                    </p>
                                </Col>
                                {assistanceItem.supporting_document && (
                                    <Col md={12}>
                                        <p>
                                            <strong>Supporting Document:</strong>{" "}
                                            <a
                                                href={assistanceItem.supporting_document}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary"
                                            >
                                                View Document
                                            </a>
                                        </p>
                                    </Col>
                                )}
                            </Row>
                        </div>
                    )}

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="status" className="fw-bold">
                                        Update Status
                                    </Label>
                                    <select
                                        className={`form-control ${classnames({
                                            "is-invalid": errors.status,
                                        })}`}
                                        id="status"
                                        {...register("status", {
                                            required: "Status is required.",
                                        })}
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Approved">Approved</option>
                                        <option value="Declined">Declined</option>
                                    </select>
                                    {errors.status && (
                                        <small className="text-danger">{errors.status.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col>
                                <Button
                                    type="submit"
                                    color="orange"
                                    disabled={isUpdating}
                                    className="me-2 px-4"
                                >
                                    {isUpdating ? "Updating..." : "Update Status"}
                                </Button>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={() => navigate("/admin/requests")}
                                    className="px-4"
                                >
                                    Back
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default AdminRequestView;
