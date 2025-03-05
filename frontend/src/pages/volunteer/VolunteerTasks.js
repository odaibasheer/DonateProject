import { Col, Row, Card, UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from "reactstrap";
import { useGetVolunteerTasksQuery } from "../../redux/api/taskAPI";
import { useEffect } from "react";
import DataTable from 'react-data-table-component';
import { ChevronDown, MoreVertical, Eye } from 'react-feather';
import { useNavigate } from "react-router-dom";
import FullScreenLoader from "../../components/FullScreenLoader";

const VolunteerTasks = () => {
    const navigate = useNavigate();

    const { data: volunteerTasks, refetch, isLoading } = useGetVolunteerTasksQuery();

    useEffect(() => {
        refetch();
    }, [refetch]);

    const renderBadge = (type, value) => {
        const badgeColors = {
            // Status badges
            Pending: 'info',
            'In Transit': 'warning',
            Delivered: 'success',

            // Urgency badges
            Low: 'success',
            Medium: 'warning',
            High: 'danger',
        };

        const defaultColor = 'secondary'; // Fallback color for unsupported values

        return (
            <Badge color={badgeColors[value] || defaultColor} className="px-3 py-2" pill>
                {value}
            </Badge>
        );
    };

    const columns = [
        {
            name: 'Type',
            selector: (row) => row.type,
            sortable: true,
        },
        {
            name: 'Location',
            selector: (row) => row.location,
            sortable: true,
        },
        {
            name: 'Assigned User',
            selector: (row) => row.assign?.username,
            sortable: true,
        },
        {
            name: 'Status',
            cell: (row) => renderBadge('status', row.status),
        },
        {
            name: 'Urgency',
            cell: (row) => renderBadge('urgency', row.urgency),
        },
        {
            name: 'Actions',
            width: '120px',
            cell: (row) => (
                <>
                    <UncontrolledDropdown>
                        <DropdownToggle tag="div" className="btn btn-sm">
                            <MoreVertical size={14} className="cursor-pointer action-btn" />
                        </DropdownToggle>
                        <DropdownMenu end container="body">
                            <DropdownItem className="w-100" onClick={() => navigate(`/volunteer/tasks/view-task/${row._id}`)}>
                                <Eye size={14} className="mx-1" />
                                <span className="align-middle mx-2">View</span>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </>
            ),
        },
    ];

    if(isLoading) {
        return (<FullScreenLoader />);
    }

    return (
        <div className="main-view container">
            <Row>
                <Col>
                    <h3>Volunteer Tasks</h3>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <DataTable
                            title="Tasks"
                            data={volunteerTasks || []}
                            responsive
                            className="react-dataTable"
                            noHeader
                            pagination
                            paginationRowsPerPageOptions={[15, 30, 50, 100]}
                            columns={columns}
                            sortIcon={<ChevronDown />}
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default VolunteerTasks;