/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Card, CardBody, Col, Form, Row, Label, Button } from "reactstrap";
import { isObjEmpty } from "../../utils/Utils";
import classnames from 'classnames';
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import Autocomplete from 'react-google-autocomplete';
import { useGetUsersQuery } from "../../redux/api/userAPI";
import { useUpdateTaskMutation, useGetTaskQuery } from "../../redux/api/taskAPI";

const AdminShippingUpdate = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get task ID from URL parameters
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        setValue,
        formState: { errors },
    } = useForm();

    const [locationObj, setLocationObj] = useState(null);

    // Fetch task details by ID
    const { data: task, isLoading: isLoadingTask } = useGetTaskQuery(id);

    // Fetch volunteers
    const queryParams = { role: "Volunteer" };
    const { data: volunteers, isLoading: isLoadingVolunteer } = useGetUsersQuery(queryParams);

    // Update task mutation
    const [updateTask, { isLoading, isError, error, isSuccess }] = useUpdateTaskMutation();

    useEffect(() => {
        // Prefill form with task data
        if (task) {
            console.log(task)
            setValue("type", task.type);
            setValue("assign", task.assign?._id || "");
            setValue("urgency", task.urgency);
            setLocationObj(task.location);
        }
    }, [task]);

    const onSubmit = (data) => {
        if (!locationObj) {
            setError('location', {
                type: 'manual',
                message: 'Please select a location using the suggested option'
            });
        }
        if (isObjEmpty(errors)) {
            data.location = locationObj;
            updateTask({ id, ...data });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success("Shipping updated successfully!");
            navigate('/admin/shipping');
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data;
            toast.error(errorMsg, { position: 'top-right' });
        }
    }, [isSuccess, isError, error, navigate]);

    return (
        <div className="main-view container">
            <Row>
                <Col>
                    <h3 className="my-3">Update Shipping</h3>
                    <Card>
                        <CardBody>
                            {isLoadingTask ? (
                                <p>Loading task details...</p>
                            ) : (
                                <Form onSubmit={handleSubmit(onSubmit)}>
                                    <Row>
                                        <Col md={6}>
                                            <div className="mb-2">
                                                <Label>Task Type</Label>
                                                <select
                                                    className={`form-control ${classnames({ 'is-invalid': errors.type })}`}
                                                    {...register('type', { required: 'Task Type is required.' })}
                                                >
                                                    <option value="">Select Type</option>
                                                    <option value="Pickup">Pickup</option>
                                                    <option value="Delivery">Delivery</option>
                                                </select>
                                                {errors.type && (
                                                    <small className="text-danger">{errors.type.message}</small>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-2">
                                                <Label>Location</Label>
                                                <Autocomplete
                                                    className="form-control"
                                                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                                    onPlaceSelected={(place) => {
                                                        clearErrors('location');
                                                        setLocationObj(place);
                                                    }}
                                                    options={{
                                                        types: ['address'],
                                                        componentRestrictions: { country: 'il' },
                                                    }}
                                                    defaultValue={locationObj || ""}
                                                />
                                                {errors.location && (
                                                    <small className="text-danger mt-1">{errors.location.message}</small>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-2">
                                                <Label>Assigned Volunteer</Label>
                                                <select
                                                    className={`form-control ${classnames({ 'is-invalid': errors.assign })}`}
                                                    {...register('assign', { required: 'Assigned Volunteer is required.' })}
                                                    disabled={isLoadingVolunteer}
                                                >
                                                    <option value="">Select Volunteer</option>
                                                    {volunteers?.map((volunteer) => (
                                                        <option key={volunteer._id} value={volunteer._id}>
                                                            {volunteer.username}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.assign && (
                                                    <small className="text-danger">{errors.assign.message}</small>
                                                )}
                                            </div>
                                        </Col>

                                        <Col md={6}>
                                            <div className="mb-2">
                                                <Label>Urgency</Label>
                                                <select
                                                    className={`form-control ${classnames({ 'is-invalid': errors.urgency })}`}
                                                    {...register('urgency', { required: 'Urgency is required.' })}
                                                >
                                                    <option value="">Select Urgency</option>
                                                    <option value="Low">Low</option>
                                                    <option value="Medium">Medium</option>
                                                    <option value="High">High</option>
                                                </select>
                                                {errors.urgency && (
                                                    <small className="text-danger">{errors.urgency.message}</small>
                                                )}
                                            </div>
                                        </Col>
                                    </Row>
                                    <div className="my-3">
                                        <Button
                                            color="orange"
                                            className="btn-block"
                                            type="submit"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Saving..." : "Update"}
                                        </Button>
                                    </div>
                                </Form>
                            )}
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminShippingUpdate;
