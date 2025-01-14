import React, { useEffect } from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle } from 'reactstrap';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { useGetNeedyDashboardQuery } from '../../redux/api/dashboardAPI';
import FullScreenLoader from '../../components/FullScreenLoader';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const NeedyDashboard = () => {
    const { data: statData, refetch, isLoading } = useGetNeedyDashboardQuery();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const dailyChartData = {
        labels: statData?.dailyRequests.map((req) => req.date),
        datasets: [
            {
                label: 'Daily Requests',
                data: statData?.dailyRequests.map((req) => req.count),
                backgroundColor: 'rgba(75,192,192,0.4)',
                borderColor: 'rgba(75,192,192,1)',
                borderWidth: 1,
            },
        ],
    };

    const monthlyChartData = {
        labels: statData?.monthlyRequests.map((req) => req.month),
        datasets: [
            {
                label: 'Monthly Requests',
                data: statData?.monthlyRequests.map((req) => req.count),
                backgroundColor: 'rgba(153,102,255,0.4)',
                borderColor: 'rgba(153,102,255,1)',
                borderWidth: 1,
            },
        ],
    };

    if (isLoading) {
        return (<FullScreenLoader />);
    }

    return (
        <Container className='main-view'>
            <h2 className="my-4">Dashboard</h2>
            <Row>
                <Col md="4">
                    <Card className="text-white text-center bg-success">
                        <CardBody>
                            <CardTitle tag="h5">Approved Requests</CardTitle>
                            <h2>{statData?.approved}</h2>
                        </CardBody>
                    </Card>
                </Col>
                <Col md="4">
                    <Card className="text-white text-center bg-warning">
                        <CardBody>
                            <CardTitle tag="h5">Pending Requests</CardTitle>
                            <h2>{statData?.pending}</h2>
                        </CardBody>
                    </Card>
                </Col>

                <Col md="4">
                    <Card className="text-white text-center bg-danger">
                        <CardBody>
                            <CardTitle tag="h5">Declined Requests</CardTitle>
                            <h2>{statData?.declined}</h2>
                        </CardBody>
                    </Card>
                </Col>
            </Row>

            <Row className="mt-5">
                <Col md="6">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Daily Assistance Requests</CardTitle>
                            <Bar data={dailyChartData} />
                        </CardBody>
                    </Card>
                </Col>
                <Col md="6">
                    <Card>
                        <CardBody>
                            <CardTitle tag="h5">Monthly Assistance Requests</CardTitle>
                            <Bar data={monthlyChartData} />
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default NeedyDashboard;
