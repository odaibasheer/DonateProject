import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Table, Button } from 'reactstrap';
import { Bar, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
} from 'chart.js';

// Register necessary Chart.js components
ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const AdminTransparencyReport = () => {
    // Data for Homepage Stats (Public)
    const totalDonations = 5000; // Example total
    const totalDistributed = 4500; // Example total
    const completedDistributions = [
        { id: 1, image: 'image1.jpg', summary: 'Distribution to 100 families in City A' },
        { id: 2, image: 'image2.jpg', summary: 'School supplies to 200 students in City B' },
    ];

    // Data for Admin Reports
    const donationsData = {
        labels: ['Food', 'Clothes', 'Money', 'Books'],
        datasets: [
            {
                label: 'Donations by Type',
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                data: [1200, 1500, 1800, 700], // Example data
            },
        ],
    };

    const requestsData = {
        labels: ['Resolved', 'Pending', 'Rejected'],
        datasets: [
            {
                label: 'Assistance Requests',
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                data: [40, 15, 5], // Example data
            },
        ],
    };

    const volunteerData = {
        labels: ['Completed', 'In Progress', 'Not Started'],
        datasets: [
            {
                label: 'Volunteer Task Completion',
                backgroundColor: ['#007bff', '#ffc107', '#dc3545'],
                data: [60, 20, 10], // Example data
            },
        ],
    };

    return (
        <Container className="main-view">
            <h2 className="text-center">Transparency and Reporting</h2>
            <Row className="mt-5">
                <Col>
                    <h4 className="text-center">Homepage Stats (Public)</h4>
                    <Card className="mb-4">
                        <CardBody>
                            <Row>
                                <Col md="6" className="text-center">
                                    <CardTitle tag="h5">Total Donations Received</CardTitle>
                                    <h3>{totalDonations}</h3>
                                </Col>
                                <Col md="6" className="text-center">
                                    <CardTitle tag="h5">Total Donations Distributed</CardTitle>
                                    <h3>{totalDistributed}</h3>
                                </Col>
                            </Row>
                        </CardBody>
                    </Card>
                    <h5>Completed Distributions:</h5>
                    <Row>
                        {completedDistributions.map((dist) => (
                            <Col md="6" key={dist.id}>
                                <Card className="mb-3">
                                    <img
                                        src={dist.image}
                                        alt="Distribution"
                                        className="card-img-top"
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                    <CardBody>
                                        <p>{dist.summary}</p>
                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <h4 className="text-center">Reports for Admin</h4>
                    <Row className="mt-4">
                        <Col md="6">
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h5" className="text-center">
                                        Donations by Type
                                    </CardTitle>
                                    <Pie data={donationsData}
                                        style={{ height: '300px', width: '300px', margin: '0 auto' }} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h5" className="text-center">
                                        Assistance Requests Status
                                    </CardTitle>
                                    <Pie data={requestsData}
                                        style={{ height: '300px', width: '300px', margin: '0 auto' }} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                    <Row className="mt-4">
                        <Col>
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h5" className="text-center">
                                        Volunteer Task Completion
                                    </CardTitle>
                                    <Bar data={volunteerData} />
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col>
                    <h4>Admin Reports (Detailed)</h4>
                    <Table bordered>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Report Type</th>
                                <th>Details</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Donations Report</td>
                                <td>Details of donations by type, status, and purpose</td>
                                <td>
                                    <Button color="primary" size="sm">
                                        Download
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>2</td>
                                <td>Assistance Requests</td>
                                <td>Resolution statuses of assistance requests</td>
                                <td>
                                    <Button color="primary" size="sm">
                                        Download
                                    </Button>
                                </td>
                            </tr>
                            <tr>
                                <td>3</td>
                                <td>Volunteer Tasks</td>
                                <td>Statistics of volunteer task completion</td>
                                <td>
                                    <Button color="primary" size="sm">
                                        Download
                                    </Button>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </Col>
            </Row>
        </Container>
    );
};

export default AdminTransparencyReport;
