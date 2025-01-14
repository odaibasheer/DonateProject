/* eslint-disable react-hooks/exhaustive-deps */
import {
    Button,
    Card,
    CardBody,
    Col,
    Container,
    Form,
    Label,
    Row,
} from "reactstrap";
import { useForm } from 'react-hook-form';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetUserQuery, useUpdateUserMutation } from "../../redux/api/userAPI";

const AdminUserUpdate = () => {
    const { id } = useParams();
    const { data: user, refetch: refetchUser } = useGetUserQuery(id || '', {
        skip: !id,
    });
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [updateUser, { isLoading, isSuccess, error, isError, data }] = useUpdateUserMutation();

    useEffect(() => {
        refetchUser();
    }, []);

    useEffect(() => {
        if (user) {
            const fields = ['username', 'email', 'phone', 'role', 'address', 'age', 'socio_economic_status', 'skills', 'availability'];
            fields.forEach((field) => setValue(field, user[field]));
        }
    }, [user]);

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/admin/users');
        }
        if (isError) {
            const errorMsg = error?.data?.message || error?.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading]);

    const onSubmit = (data) => {
        updateUser({ id, user: data });
    };

    const roleOptions = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Donor', label: 'Donor' },
        { value: 'Needy', label: 'Needy' },
        { value: 'Volunteer', label: 'Volunteer' },
    ];

    return (
        <div className="main-view">
            <Container>
                <h3 className="my-3">Update User</h3>
                <Card>
                    <CardBody>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col md="6">
                                    <div className="mb-2">
                                        <Label>User Name</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.username })}`}
                                            type="text"
                                            {...register('username', { required: true })}
                                        />
                                        {errors.username && (
                                            <small className="text-danger">User Name is required.</small>
                                        )}
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-2">
                                        <Label>Email Address</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                            type="email"
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
                                    </div>
                                </Col>
                                
                                <Col md="6">
                                    <div className="mb-2">
                                        <Label>Phone</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.phone })}`}
                                            type="text"
                                            {...register('phone', { required: true })}
                                        />
                                        {errors.phone && (
                                            <small className="text-danger">Phone is required.</small>
                                        )}
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-2">
                                        <Label>Role</Label>
                                        <select
                                            className={`form-control ${classnames({ 'is-invalid': errors.role })}`}
                                            {...register('role', { required: true })}
                                        >
                                            {roleOptions.map((role) => (
                                                <option key={role.value} value={role.value}>
                                                    {role.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.role && (
                                            <small className="text-danger">Role selection is required.</small>
                                        )}
                                    </div>
                                </Col>
                                {user?.role === 'Needy' && (
                                    <>
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Address</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.address })}`}
                                                    type="text"
                                                    {...register('address', { required: true })}
                                                />
                                                {errors.address && (
                                                    <small className="text-danger">Address is required for Needy.</small>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Age</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.age })}`}
                                                    type="number"
                                                    {...register('age', { required: true })}
                                                />
                                                {errors.age && (
                                                    <small className="text-danger">Age is required for Needy.</small>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Socio-economic Status</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.socio_economic_status })}`}
                                                    type="text"
                                                    {...register('socio_economic_status', { required: true })}
                                                />
                                                {errors.socio_economic_status && (
                                                    <small className="text-danger">Socio-economic Status is required for Needy.</small>
                                                )}
                                            </div>
                                        </Col>
                                    </>
                                )}
                                {user?.role === 'Volunteer' && (
                                    <>
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Skills</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.skills })}`}
                                                    type="text"
                                                    {...register('skills', { required: true })}
                                                />
                                                {errors.skills && (
                                                    <small className="text-danger">Skills are required for Volunteer.</small>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Availability</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.availability })}`}
                                                    type="text"
                                                    {...register('availability', { required: true })}
                                                />
                                                {errors.availability && (
                                                    <small className="text-danger">Availability is required for Volunteer.</small>
                                                )}
                                            </div>
                                        </Col>
                                    </>
                                )}
                                <div className="mt-4">
                                    <Button
                                        color="primary"
                                        className="btn-block"
                                        type="submit"
                                        disabled={isLoading}
                                    >
                                        {isLoading ? "Saving..." : "Update"}
                                    </Button>
                                </div>
                            </Row>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
};

export default AdminUserUpdate;
