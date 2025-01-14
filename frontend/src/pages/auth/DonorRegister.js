/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Label, Button, Card, CardBody, Row, Col } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import { toast } from 'react-toastify';
import logo1Img from '../../assets/images/logo.png';
import { useRegisterUserMutation } from '../../redux/api/authAPI';
import { isObjEmpty } from '../../utils/Utils';

const DonorRegister = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    // 👇 Calling the Register Mutation
    const [registerUser, { isLoading, isSuccess, error, isError, data }] = useRegisterUserMutation();

    const navigate = useNavigate();

    const onSubmit = (data) => {
        if (isObjEmpty(errors)) {
            data.role = 'Donor';
            registerUser(data);
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message);
            navigate('/login');
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading, isSuccess, isError, error, data, navigate]);

    return (
        <div className="auth-wrapper auth-v1 px-2 auth-background">
            <div className="auth-inner py-2">
                <Card className="mb-0">
                    <CardBody>
                        <div className="mb-4 d-flex justify-content-center">
                            <img className="logo" src={logo1Img} alt="Materials" />
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <div className="body-meta">
                                    Looking for care?{' '}
                                    <div>
                                        <Link to="/needy-register">
                                            <span className="fw-bold">Sign up as a Needy →</span>
                                        </Link>
                                    </div>
                                    <div>
                                        <Link to="/volunteer-register">
                                            <span className="fw-bold">Sign up as a Volunteer →</span>
                                        </Link>
                                    </div>

                                </div>
                                <h4 className="text-start">Donor, create an account</h4>
                                <p className="body-2 md-vertical-spacing">
                                    Already have an account?{' '}
                                    <a href="/login" className="fw-bold">
                                        Log in
                                    </a>
                                </p>
                            </div>
                        </div>
                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <Row>
                                <Col md={6}>
                                    <div className="mb-2">
                                        <Label>Username</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.username })}`}
                                            type="text"
                                            id="username"
                                            {...register('username', { required: true })}
                                        />
                                        {errors.username && (
                                            <small className="text-danger">Username is required.</small>
                                        )}
                                    </div>
                                </Col>
                                <Col md={6}>
                                    <div className="mb-2">
                                        <Label>Email</Label>
                                        <input
                                            className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                            type="email"
                                            id="email"
                                            {...register('email', { required: true })}
                                        />
                                        {errors.email && <small className="text-danger">Email is required.</small>}
                                    </div>
                                </Col>

                            </Row>
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
                            <div className="mb-2">
                                <Label>Password</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                    type="password"
                                    id="password"
                                    {...register('password', { required: true })}
                                />
                                {errors.password && <small className="text-danger">Password is required.</small>}
                            </div>

                            <div className="mt-4">
                                <Button color="orange" className="btn btn-block w-100" type="submit">
                                    Register
                                </Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default DonorRegister;
