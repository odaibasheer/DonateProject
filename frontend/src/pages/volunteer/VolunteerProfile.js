/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { Container, Row, Col, Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import classnames from 'classnames';
import { useForm } from 'react-hook-form';
import { useGetProfileQuery, useUpdateProfileMutation } from '../../redux/api/userAPI';
import { toast } from 'react-toastify';
import FullScreenLoader from '../../components/FullScreenLoader';

const VolunteerProfile = () => {
    const { data: profile, refetch, isLoading } = useGetProfileQuery();
    const [updateProfile, { isLoading: isProfileLoading, isSuccess, error, isError, data }] = useUpdateProfileMutation();

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    useEffect(() => {
        refetch();
    }, [refetch]);

    useEffect(() => {
        if (profile) {
            const fields = ['username', 'email', 'phone', 'skills', 'availability'];
            fields.forEach((field) => setValue(field, profile[field] || ''));
        }
    }, [profile, setValue]);

    const onSubmit = async (formData) => {
        if (profile && profile._id) {
            await updateProfile({ ...formData, profileId: profile._id });
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || 'Profile updated successfully!');
        }
        if (isError) {
            const errorMsg = error?.data?.message || 'An error occurred while updating the profile.';
            toast.error(errorMsg);
        }
    }, [isSuccess, isError, data, error]);

    if (isLoading || isProfileLoading) {
        return <FullScreenLoader />;
    }

    return (
        <Container className='main-view'>
            <h2 className="my-4">Volunteer Profile</h2>
            <Card>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="username">Username</Label>
                                    <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        className={`form-control ${classnames({ 'is-invalid': errors.username })}`}
                                        {...register('username', { required: 'Username is required.' })}
                                    />
                                    {errors.username && (
                                        <small className="text-danger">{errors.username.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="email">Email</Label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                        {...register('email', {
                                            required: 'Email is required.',
                                            pattern: {
                                                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                                                message: 'Please enter a valid email address.',
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <small className="text-danger">{errors.email.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="phone">Phone</Label>
                                    <input
                                        type="text"
                                        name="phone"
                                        id="phone"
                                        className={`form-control ${classnames({ 'is-invalid': errors.phone })}`}
                                        {...register('phone', { required: 'Phone number is required.' })}
                                    />
                                    {errors.phone && (
                                        <small className="text-danger">{errors.phone.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="skills">Skills</Label>
                                    <input
                                        type="text"
                                        name="skills"
                                        id="skills"
                                        className={`form-control ${classnames({ 'is-invalid': errors.skills })}`}
                                        {...register('skills', { required: 'Skills are required.' })}
                                    />
                                    {errors.skills && (
                                        <small className="text-danger">{errors.skills.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="availability">Availability</Label>
                                    <input
                                        type="text"
                                        name="availability"
                                        id="availability"
                                        className={`form-control ${classnames({ 'is-invalid': errors.availability })}`}
                                        {...register('availability', { required: 'Availability is required.' })}
                                    />
                                    {errors.availability && (
                                        <small className="text-danger">{errors.availability.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <div className='my-3'>
                            <Button type="submit" color="primary">
                                Save Changes
                            </Button>
                        </div>
                    </Form>
                </CardBody>
            </Card>
        </Container>
    );
};

export default VolunteerProfile;