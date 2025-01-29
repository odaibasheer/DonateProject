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
import { useNavigate } from "react-router-dom";
import { useCreateUserMutation } from "../../redux/api/userAPI";
import { useEffect, useState } from "react";
import Autocomplete from 'react-google-autocomplete';
import { isObjEmpty } from "../../utils/Utils";

const AdminUserCreate = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors },
    } = useForm();

    const [createUser, { isLoading, isSuccess, error, isError, data }] = useCreateUserMutation();

    const selectedRole = watch('role');
    const [addressObj, setAddressObj] = useState(null);

    const onSubmit = (data) => {
        // Validate if address is selected
        if (!addressObj) {
            setError('address', {
                type: 'manual',
                message: 'Please select an address using the suggested option'
            });
        }

        // Ensure no errors before submitting
        if (isObjEmpty(errors)) {
            data.address = addressObj;
            createUser(data);
        }
    };

    useEffect(() => {
        console.log(isSuccess, isError)
        if (isSuccess) {
            toast.success(data?.message || "User created successfully!");
            navigate('/admin/users');
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data;
            toast.error(errorMsg, { position: 'top-right' });
        }
    }, [isLoading, isSuccess, isError, error, navigate]);

    const roleOptions = [
        { value: 'Admin', label: 'Admin' },
        { value: 'Donor', label: 'Donor' },
        { value: 'Needy', label: 'Needy' },
        { value: 'Volunteer', label: 'Volunteer' },
    ];

    return (
        <div className="main-view">
            <Container>
                <h3 className="my-3">Create User</h3>
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
                                            {...register('username', { required: 'User Name is required.' })}
                                        />
                                        {errors.username && (
                                            <small className="text-danger">{errors.username.message}</small>
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
                                        <Label>Password</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                            type="password"
                                            {...register('password', { required: 'Password is required.' })}
                                        />
                                        {errors.password && (
                                            <small className="text-danger">{errors.password.message}</small>
                                        )}
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-2">
                                        <Label>Phone</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.phone })}`}
                                            type="text"
                                            {...register('phone', { required: 'Phone number is required.' })}
                                        />
                                        {errors.phone && (
                                            <small className="text-danger">{errors.phone.message}</small>
                                        )}
                                    </div>
                                </Col>
                                <Col md="6">
                                    <div className="mb-2">
                                        <Label>Role</Label>
                                        <select
                                            className={`form-control ${classnames({ 'is-invalid': errors.role })}`}
                                            {...register('role', { required: 'Role selection is required.' })}
                                        >
                                            {roleOptions.map((role) => (
                                                <option key={role.value} value={role.value}>
                                                    {role.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.role && (
                                            <small className="text-danger">{errors.role.message}</small>
                                        )}
                                    </div>
                                </Col>

                                {/* Fields for Needy role */}
                                {selectedRole === 'Needy' && (
                                    <>
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Address</Label>
                                                <Autocomplete
                                                    className="form-control"
                                                    apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
                                                    onPlaceSelected={(place) => {
                                                        clearErrors('address');
                                                        setAddressObj(place);
                                                    }}
                                                    options={{
                                                        types: ['address'],
                                                        componentRestrictions: { country: 'il' },
                                                    }}
                                                />
                                                {errors.address && (
                                                    <small className="text-danger mt-1">{errors.address.message}</small>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Age</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.age })}`}
                                                    type="number"
                                                    {...register('age', { required: 'Age is required for Needy.' })}
                                                />
                                                {errors.age && (
                                                    <small className="text-danger">{errors.age.message}</small>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Socio-economic Status</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.socio_economic_status })}`}
                                                    type="text"
                                                    {...register('socio_economic_status', { required: 'Socio-economic status is required for Needy.' })}
                                                />
                                                {errors.socio_economic_status && (
                                                    <small className="text-danger">{errors.socio_economic_status.message}</small>
                                                )}
                                            </div>
                                        </Col>
                                    </>
                                )}

                                {/* Fields for Volunteer role */}
                                {selectedRole === 'Volunteer' && (
                                    <>
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Skills</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.skills })}`}
                                                    type="text"
                                                    {...register('skills', { required: 'Skills are required for Volunteer.' })}
                                                />
                                                {errors.skills && (
                                                    <small className="text-danger">{errors.skills.message}</small>
                                                )}
                                            </div>
                                        </Col>
                                        <Col md="6">
                                            <div className="mb-2">
                                                <Label>Availability</Label>
                                                <input
                                                    className={`form-control ${classnames({ 'is-invalid': errors.availability })}`}
                                                    type="text"
                                                    {...register('availability', { required: 'Availability is required for Volunteer.' })}
                                                />
                                                {errors.availability && (
                                                    <small className="text-danger">{errors.availability.message}</small>
                                                )}
                                            </div>
                                        </Col>
                                    </>
                                )}
                            </Row>
                            <div className="my-3">
                                <Button
                                    color="primary"
                                    className="btn-block"
                                    type="submit"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Saving..." : "Create"}
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </Container>
        </div>
    );
};

export default AdminUserCreate;
