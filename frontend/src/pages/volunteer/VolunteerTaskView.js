/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import { useForm } from "react-hook-form";
import classnames from "classnames";
import { useGetTaskQuery, useUpdateTaskStatusMutation } from "../../redux/api/taskAPI";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import FullScreenLoader from "../../components/FullScreenLoader";

const VolunteerTaskView = () => {
    const navigate = useNavigate();
    const { id } = useParams();

    // Fetch the task details
    const { data: task, isError, error, isLoading } = useGetTaskQuery(id);

    console.log(task)

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    // Mutation to update task status
    const [updateTaskStatus, { isLoading: isUpdating, isError: isUpdateError, error: updateError, isSuccess }] =
        useUpdateTaskStatusMutation();

    // Populate form with existing task data
    useEffect(() => {
        if (task) {
            setValue("status", task.status);
        }

        if (isError) {
            toast.error(error?.data?.message || "Error fetching task details.");
        }
    }, [task, isError]);

    // Handle form submission to update task status
    const onSubmit = async (formData) => {
        try {
            await updateTaskStatus({ id, task: { status: formData.status } });
        } catch (err) {
            toast.error("Error updating the task status.");
        }
    };

    // Handle post-update actions
    useEffect(() => {
        if (isSuccess) {
            toast.success("Task status updated successfully!");
            navigate("/volunteer/tasks");
        }

        if (isUpdateError) {
            toast.error(updateError?.data?.message || "Error updating task status.");
        }
    }, [isSuccess, isUpdateError]);

    // Display a loader while fetching task data
    if (isLoading) {
        return <FullScreenLoader />;
    }

    return (
        <div className="container main-view">
            <Row className="mt-4">
                <Col>
                    <h2 className="text-start">Task Detail</h2>
                </Col>
            </Row>
            <Card className="shadow-sm mt-4">
                <CardBody>
                    {task && (
                        <div className="mb-4">
                            <Row>
                                <Col md={6}>
                                    <p className="mb-2">
                                        <strong>Type:</strong>{" "}
                                        <span className="text-muted">{task.type}</span>
                                    </p>
                                </Col>
                                <Col md={6}>
                                    <p className="mb-2">
                                        <strong>Urgency:</strong>{" "}
                                        <span
                                            className={`badge ${
                                                task.urgency === "High"
                                                    ? "bg-danger"
                                                    : task.urgency === "Medium"
                                                    ? "bg-warning text-dark"
                                                    : "bg-success"
                                            }`}
                                        >
                                            {task.urgency}
                                        </span>
                                    </p>
                                </Col>
                                <Col md={12}>
                                    <p className="mb-2">
                                        <strong>Location:</strong>{" "}
                                        <span className="text-muted">{task.location}</span>
                                    </p>
                                </Col>
                                <Col md={12}>
                                    <p className="mb-2">
                                        <strong>Assistance ID:</strong>{" "}
                                        <span className="text-muted">{task.assistance._id}</span>
                                    </p>
                                </Col>
                            </Row>
                        </div>
                    )}

                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="status" className="fw-bold">
                                        Update Task Status
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
                                        <option value="In Transit">In Transit</option>
                                        <option value="Delivered">Delivered</option>
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
                                    {isUpdating ? "Updating..." : "Update"}
                                </Button>
                                <Button
                                    type="button"
                                    color="secondary"
                                    onClick={() => navigate("/volunteer/tasks")}
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

export default VolunteerTaskView;
