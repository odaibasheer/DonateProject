/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Card, CardBody, Col, Form, Row, Label, Button } from "reactstrap";
import { isObjEmpty } from "../../utils/Utils";
import classnames from 'classnames';
import { useCreateTaskMutation } from "../../redux/api/taskAPI";
import Autocomplete from 'react-google-autocomplete';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import { useGetUsersQuery } from "../../redux/api/userAPI";

const AdminShippingCreate = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm();

    const queryParams = {
        role: "Volunteer"
    };
    const { data: volunteers, refetch, isLoading: isLoadingVolunteer } = useGetUsersQuery(queryParams);

    useEffect(() => {
        refetch();
    }, [refetch]);

    const [createTask, { isLoading, isError, error, isSuccess, data }] = useCreateTaskMutation();

    const [locationObj, setLocationObj] = useState(null);

    const onSubmit = (data) => {
        if (!locationObj) {
            setError('location', {
                type: 'manual',
                message: 'Please select a location using the suggested option'
            });
        }
        // Ensure no errors before submitting
        if (isObjEmpty(errors)) {
            data.location = locationObj;
            createTask(data);
        }
    };

    useEffect(() => {
        console.log(isSuccess, isError);
        if (isSuccess) {
            toast.success(data?.message || "Task created successfully!");
            navigate('/admin/shipping');
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data;
            toast.error(errorMsg, { position: 'top-right' });
        }
    }, [isLoading, isSuccess, isError, error, navigate]);

    return (
        <div className="main-view container">
            <Row>
                <Col>
                    <h3 className="my-3">Track Shipping and Logistics</h3>
                    <Card>
                        <CardBody>
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
                                        {isLoading ? "Saving..." : "Track"}
                                    </Button>
                                </div>
                            </Form>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminShippingCreate;
