import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Table, Button } from 'reactstrap';
import { Bar, Pie } from 'react-chartjs-2';
import { useGetAdminReportQuery } from '../../redux/api/reportAPI';
import FullScreenLoader from '../../components/FullScreenLoader';
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
    const { data: report, refetch, isLoading } = useGetAdminReportQuery();

    useEffect(() => {
        refetch();
    }, [refetch]);

    if (isLoading) {
        return <FullScreenLoader />;
    }

    // Data for Homepage Stats (Public)
    const totalDonations = report ? report.totalReceivedDonations : 0;
    const totalDistributed = report ? report.totalDistributedDonations : 0;

    // Data for Admin Reports
    const donationsData = {
        labels: report.donationsByType.map(item => item.type),
        datasets: [
            {
                label: 'Donations by Type',
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
                data: report.donationsByType.map(item => item.totalDonations),
            },
        ],
    };

    const requestsData = {
        labels: report.assistanceByStatus.map(item => item.status),
        datasets: [
            {
                label: 'Assistance Requests',
                backgroundColor: ['#28a745', '#ffc107', '#dc3545'],
                data: report.assistanceByStatus.map(item => item.totalAssistances),
            },
        ],
    };

    const volunteerData = {
        labels: report.volunteerTaskStats.map(item => item.status),
        datasets: [
            {
                label: "Total count",
                backgroundColor: ['#007bff', '#ffc107', '#dc3545'],
                data: report.volunteerTaskStats.map(item => item.totalVolunteerTasks)
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
                                    <Pie data={donationsData} style={{ height: '300px', width: '300px', margin: '0 auto' }} />
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="6">
                            <Card>
                                <CardBody>
                                    <CardTitle tag="h5" className="text-center">
                                        Assistance Requests Status
                                    </CardTitle>
                                    <Pie data={requestsData} style={{ height: '300px', width: '300px', margin: '0 auto' }} />
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
        </Container>
    );
};

export default AdminTransparencyReport;
