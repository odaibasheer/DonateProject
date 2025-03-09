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
import { useUpdateTaskMutation, useGetTaskQuery, useGetTaskAssistancesQuery, useGetTaskEnableItemsQuery } from "../../redux/api/taskAPI";

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
    const { data: task, refetch, isLoading: isLoadingTask } = useGetTaskQuery(id);

    // Fetch volunteers
    const queryParams = { role: "Volunteer" };
    const { data: volunteers, isLoading: isLoadingVolunteer } = useGetUsersQuery(queryParams);

    // Fetch assistances
    const { data: assistances, refetch: refetchAssistance } = useGetTaskAssistancesQuery();
    const { data: donations, refetch: refetchDonation } = useGetTaskEnableItemsQuery();

    useEffect(() => {
        refetch();
        refetchDonation();
        refetchAssistance();
    }, [refetch, refetchDonation, refetchAssistance]);

    // Update task mutation
    const [updateTask, { isLoading, isError, error, isSuccess }] = useUpdateTaskMutation();

    useEffect(() => {
        if (task) {
            setValue("title", task.title);
            setValue("type", task.type);
            setValue("assign", task.assign?._id || "");
            setValue("assistance", task.assistance?._id || "");
            setValue("urgency", task.urgency);
            setValue("donation", task.donation?._id || "");
            setValue("quantity", task.quantity || 0);
            setLocationObj(task.location);
        }
    }, [task, assistances]);

    const onSubmit = (data) => {
        if (!locationObj) {
            setError('location', {
                type: 'manual',
                message: 'Please select a location using the suggested option'
            });
        }
        if (isObjEmpty(errors)) {
            data.location = locationObj;
            updateTask({ id, task: data });
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
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Title</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.title })}`}
                                                    type="text"
                                                    {...register('title', { required: true })}
                                                />
                                                {errors.title && (
                                                    <small className="text-danger">Title is required.</small>
                                                )}
                                            </div>
                                        </Col>
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
                                                <Label>Assign Assistance</Label>
                                                <select
                                                    className={`form-control ${classnames({ 'is-invalid': errors.assistance })}`}
                                                    {...register('assistance', {
                                                        required: 'Assign Assistance is required.',
                                                    })}
                                                    disabled
                                                >
                                                    <option value="">Select Assistance</option>
                                                    {assistances?.map((assistance) => (
                                                        <option key={assistance._id} value={assistance._id}>
                                                            {assistance.title}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.assistance && (
                                                    <small className="text-danger">{errors.assistance.message}</small>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-2">
                                                <Label>Assign Donation</Label>
                                                <select
                                                    className={`form-control ${classnames({ 'is-invalid': errors.donation })}`}
                                                    {...register('donation', {
                                                        required: 'Assign Donation is required.',
                                                    })}
                                                    disabled
                                                >
                                                    <option value="">Select Donation</option>
                                                    {donations.map((donation) => (
                                                        <option key={donation._id} value={donation._id}>
                                                            {`${donation.title} - Quantity(${donation.quantity})`}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.donation && (
                                                    <small className="text-danger">{errors.donation.message}</small>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md={6}>
                                            <div className="mb-2">
                                                <Label>Quantity</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.quantity })}`}
                                                    type="number"
                                                    {...register('quantity', {
                                                        required: 'Quantity is required.',
                                                    })}
                                                    disabled
                                                />
                                                {errors.quantity && (
                                                    <small className="text-danger">{errors.quantity.message}</small>
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
