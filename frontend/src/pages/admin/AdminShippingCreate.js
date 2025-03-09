/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Card, CardBody, Col, Form, Row, Label, Button } from "reactstrap";
import { isObjEmpty } from "../../utils/Utils";
import classnames from 'classnames';
import { useCreateTaskMutation, useGetTaskAssistancesQuery, useGetTaskEnableItemsQuery } from "../../redux/api/taskAPI";
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
        watch,
    } = useForm();

    const queryParams = {
        role: "Volunteer"
    };
    const { data: volunteers, isLoading: isLoadingVolunteer } = useGetUsersQuery(queryParams);

    const { data: assistances, isLoading: isLoadingAssistance } = useGetTaskAssistancesQuery();

    const { data: donations, isLoading: isLoadingDonation } = useGetTaskEnableItemsQuery();

    const [filteredDonations, setFilteredDonations] = useState([]);
    const [selectedAssistance, setSelectedAssistance] = useState(null);

    const selectedAssistanceId = watch("assistance");

    useEffect(() => {
        if (selectedAssistanceId) {
            // Fetch the full assistance object based on the selected ID
            const fullAssistance = assistances?.find(
                (assistance) => assistance._id === selectedAssistanceId
            );
            console.log(fullAssistance)
            setSelectedAssistance(fullAssistance);

            // Filter donations based on the selected assistance
            const matchedDonations = donations?.filter(
                (donation) => donation.type.includes(fullAssistance.type)
            );
            setFilteredDonations(matchedDonations || []);
        } else {
            setSelectedAssistance(null);
            setFilteredDonations(donations || []);
        }
    }, [selectedAssistanceId, assistances, donations]);

    const [createTask, { isLoading, isError, error, isSuccess, data }] = useCreateTaskMutation();
    const [locationObj, setLocationObj] = useState(null);

    const onSubmit = (formData) => {
        if (!locationObj) {
            setError('location', {
                type: 'manual',
                message: 'Please select a location using the suggested option'
            });
        }

        const selectedDonationDetails = donations?.find(donation => donation._id === formData.donation);
        if (selectedDonationDetails && formData.quantity > selectedDonationDetails.quantity) {
            setError('quantity', {
                type: 'manual',
                message: `Quantity cannot exceed ${selectedDonationDetails.quantity}`,
            });
            return;
        }

        if (isObjEmpty(errors)) {
            formData.location = locationObj;
            formData.assistance = selectedAssistance; // Include full assistance object
            createTask(formData);
        }
    };

    useEffect(() => {
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
                                                {...register('assistance', { required: 'Assign Assistance is required.' })}
                                                disabled={isLoadingAssistance}
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
                                                {...register('donation', { required: 'Assign Donation is required.' })}
                                                disabled={isLoadingDonation}
                                            >
                                                <option value="">Select Donation</option>
                                                {filteredDonations?.map((donation) => (
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
                                    <Col md="6">
                                        <div className="mb-2">
                                            <Label>Quantity</Label>
                                            <input
                                                className={`form-control ${classnames({ 'is-invalid': errors.quantity })}`}
                                                type="number"
                                                {...register('quantity', { required: 'Quantity is required.' })}
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
