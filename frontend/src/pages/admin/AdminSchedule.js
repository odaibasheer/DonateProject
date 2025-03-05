import React, { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import {
    Container,
    Row,
    Col,
    Button,
    Modal,
    ModalHeader,
    ModalBody,
    Form,
    FormGroup,
    Label,
    Alert,
} from 'reactstrap';
import { useForm } from 'react-hook-form';
import classnames from 'classnames';

// Localizer for react-big-calendar
const localizer = momentLocalizer(moment);

const AdminSchedule = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [events, setEvents] = useState([]);
    const [modal, setModal] = useState(false);
    const [notificationAlert, setNotificationAlert] = useState(false);

    // Toggle modal
    const toggleModal = () => {
        setModal(!modal);
    };

    // Add new event handler
    const onSubmit = (data) => {
        const { title, type, start, end } = data;
        const startDate = new Date(start);
        const endDate = new Date(end);

        if (startDate > endDate) {
            alert("End date must be after start date.");
            return;
        }

        setEvents([...events, { title, type, start: startDate, end: endDate }]);
        reset();
        toggleModal();
        setNotificationAlert(true);
        setTimeout(() => setNotificationAlert(false), 3000);
    };

    return (
        <Container>
            <Row>
                <Col>
                    <h2 className="my-4 text-center">Admin Activity Scheduler</h2>
                    <Button color="orange" onClick={toggleModal}>
                        Add New Event
                    </Button>
                </Col>
            </Row>

            <Row className="mt-4">
                <Col>
                    {notificationAlert && (
                        <Alert color="success">
                            Notifications sent to Volunteers and Donors for the new event!
                        </Alert>
                    )}
                    <Calendar
                        localizer={localizer}
                        events={events}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: 500 }}
                    />
                </Col>
            </Row>

            {/* Add Event Modal */}
            <Modal isOpen={modal} toggle={toggleModal}>
                <ModalHeader toggle={toggleModal}>Add New Event</ModalHeader>
                <ModalBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <FormGroup>
                            <Label for="title">Event Title</Label>
                            <input
                                type="text"
                                className={`form-control ${classnames({ 'is-invalid': errors.title })}`}
                                id="title"
                                placeholder="Enter event title"
                                {...register('title', {
                                    required: 'Event title is required.',
                                    maxLength: {
                                        value: 100,
                                        message: 'Title cannot exceed 100 characters.',
                                    },
                                })}
                            />
                            {errors.title && (
                                <small className="text-danger">{errors.title.message}</small>
                            )}
                        </FormGroup>
                        <FormGroup>
                            <Label for="type">Event Type</Label>
                            <select
                                className={`form-control ${classnames({ 'is-invalid': errors.type })}`}
                                id="type"
                                {...register('type', {
                                    required: 'Event type is required.',
                                })}
                            >
                                <option value="" style={{ color: 'black' }}>Select type</option>
                                <option value="Donation Drive" style={{ color: '#007bff' }}>Donation Drive</option>
                                <option value="Distribution Event" style={{ color: '#28a745' }}>Distribution Event</option>
                                <option value="Volunteer Meetup" style={{ color: '#ffc107' }}>Volunteer Meetup</option>
                            </select>
                            {errors.type && (
                                <small className="text-danger">{errors.type.message}</small>
                            )}
                        </FormGroup>
                        <FormGroup>
                            <Label for="start">Start Date and Time</Label>
                            <input
                                className={`form-control ${classnames({ 'is-invalid': errors.start })}`}
                                type="datetime-local"
                                id="start"
                                {...register('start', {
                                    required: 'Start date and time are required.',
                                })}
                            />
                            {errors.start && (
                                <small className="text-danger">{errors.start.message}</small>
                            )}
                        </FormGroup>
                        <FormGroup>
                            <Label for="end">End Date and Time</Label>
                            <input
                                type="datetime-local"
                                className={`form-control ${classnames({ 'is-invalid': errors.end })}`}
                                id="end"
                                {...register('end', {
                                    required: 'End date and time are required.',
                                })}
                            />
                            {errors.end && (
                                <small className="text-danger">{errors.end.message}</small>
                            )}
                        </FormGroup>
                        <Button type="submit" color="orange" className="mx-2">
                            Add Event
                        </Button>
                        <Button
                            type="button"
                            color="secondary"
                            onClick={toggleModal}
                            className="mx-2"
                        >
                            Cancel
                        </Button>
                    </Form>
                </ModalBody>
            </Modal>
        </Container>
    );
};

export default AdminSchedule;
