/* eslint-disable react-hooks/exhaustive-deps */
import { Form, FormGroup, Label, Button, Card, CardBody } from 'reactstrap';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import classnames from 'classnames';
import logo1Img from '../../assets/images/logo.png';
import { toast } from 'react-toastify';
import { useLoginUserMutation } from '../../redux/api/authAPI';
import { useEffect } from 'react';
import { getHomeRouteForLoggedInUser, getUserData } from '../../utils/Utils';

const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [loginUser, { isLoading, isError, error, isSuccess }] = useLoginUserMutation();

    const navigate = useNavigate();

    const onSubmit = (data) => {
        loginUser(data);
    };

    useEffect(() => {
        if (isSuccess) {
            const user = getUserData();
            toast.success('You successfully logged in');
            navigate(getHomeRouteForLoggedInUser(user.role));
        }

        if (isError) {
            const errorMsg = error?.data?.message || error?.data;
            toast.error(errorMsg, {
                position: 'top-right',
            });
        }
    }, [isLoading, isSuccess, isError, error, navigate]);

    return (
        <div className="auth-wrapper auth-v1 px-2 auth-background">
            <div className="auth-inner py-2">
                <Card className="mb-0">
                    <CardBody>
                        <div className="mb-4 d-flex justify-content-center">
                            <img className="brand-logo" src={logo1Img} alt="Donation" />
                        </div>

                        <div className="row mb-3">
                            <div className="col-12">
                                <h4 className="text-center">Login to your account</h4>
                            </div>
                        </div>

                        <Form onSubmit={handleSubmit(onSubmit)}>
                            <FormGroup>
                                <Label>Email</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.email })}`}
                                    type="email"
                                    id="email"
                                    {...register('email', { required: true })}
                                />
                                {errors.email && <small className="text-danger">Email is required.</small>}
                            </FormGroup>

                            <FormGroup>
                                <Label>Password</Label>
                                <input
                                    className={`form-control ${classnames({ 'is-invalid': errors.password })}`}
                                    type="password"
                                    id="password"
                                    {...register('password', { required: true })}
                                />
                                {errors.password && <small className="text-danger">Password is required.</small>}
                            </FormGroup>

                            <div className="mt-3">
                                <Button color="orange" className="btn btn-block w-100" type="submit">
                                    LOGIN
                                </Button>
                            </div>

                            <div className="mt-4 d-flex justify-content-center">
                                <p>
                                    Sign up as a{' '}
                                    <Link to="/donor-register">
                                        <span className='fw-bold'>Donor</span>
                                    </Link>{' '}
                                    or{' '}
                                    <Link to="/needy-register">
                                        <span className='fw-bold'>Needy</span>
                                    </Link>{' '}
                                    or{' '}
                                    <Link to="/volunteer-register">
                                        <span className='fw-bold'>Volunteer</span>
                                    </Link>
                                </p>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Login;
