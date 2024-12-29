/* eslint-disable react-hooks/exhaustive-deps */
import { Card, CardBody, Col, Row } from 'reactstrap';
import logo1Img from '../../assets/images/logo.png';

const Register = () => {
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
                                <h3 className="text-center">I am going to a ...</h3>
                            </div>
                        </div>
                        <Row className="my-3">
                            <Col md="4" sm="12">
                                <a href="/donor-register">
                                    <div className="register-type">Donor</div>
                                </a>
                            </Col>
                            <Col md="4" sm="12">
                                <a href="/needy-register">
                                    <div className="register-type">Needy</div>
                                </a>
                            </Col>
                            <Col md="4" sm="12">
                                <a href="/needy-register">
                                    <div className="register-type">Volunteer</div>
                                </a>
                            </Col>
                        </Row>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Register;
