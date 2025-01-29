/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import classnames from "classnames";
import { useCreateItemMutation } from "../../redux/api/itemAPI";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const DonationItemCreate = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const [createItem, { isLoading, isError, error, isSuccess, data }] = useCreateItemMutation();

    const onSubmit = async (data) => {
        try {
            const form = new FormData();
            form.append("type", data.type);
            form.append("quantity", data.quantity);
            form.append("description", data.description);
            form.append("purpose", data.purpose);
            if (data.image && data.image[0]) {
                form.append("image", data.image[0]);
            }

            await createItem(form);
        } catch (error) {
            toast.error("Error submitting the donation item data.");
        }
    }

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Item created successfully!");
            navigate("/donor/donation-items");
        }

        if (isError) {
            const errorData = error?.data?.error;
            if (Array.isArray(errorData)) {
                errorData.forEach((el) =>
                    toast.error(el.message, { position: "top-right" })
                );
            } else {
                toast.error(error?.data?.message || "An unexpected error occurred!", {
                    position: "top-right",
                });
            }
        }
    }, [isLoading]);

    return (
        <div className="container main-view">
            <Row className="my-3">
                <Col>
                    <h3 className="mb-3">Create Donation Item</h3>
                </Col>
            </Row>
            <Card>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="type">Donation Type</Label>
                                    <select
                                        className={`form-control ${classnames({
                                            "is-invalid": errors.type,
                                        })}`}
                                        {...register("type", { required: "Donation Type is required." })}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Money">Money</option>
                                        <option value="Clothes">Clothes</option>
                                        <option value="Medical Supplies">Medical Supplies</option>
                                        <option value="Food">Food</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Other">Other</option>
                                    </select>

                                    {errors.type && (
                                        <small className="text-danger">{errors.type.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="quantity">Quantity</Label>
                                    <input
                                        className={`form-control ${classnames({
                                            "is-invalid": errors.quantity,
                                        })}`}
                                        id="quantity"
                                        type="number"
                                        {...register("quantity", { required: "quantity is required." })}
                                    />
                                    {errors.quantity && (
                                        <small className="text-danger">{errors.quantity.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="image">Image</Label>
                                    <input
                                        className={`form-control ${classnames({
                                            "is-invalid": errors.image,
                                        })}`}
                                        id="image"
                                        type="file"
                                        accept="image/*"
                                        {...register("image", { required: "Team Icon is required." })}
                                    />
                                    {errors.image && (
                                        <small className="text-danger">{errors.image.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="description">Description</Label>
                                    <textarea
                                        id="description"
                                        className={`form-control ${classnames({ 'is-invalid': errors.description })}`}
                                        {...register('description', {
                                            required: 'Description is required.',
                                            minLength: {
                                                value: 10,
                                                message: 'Description must be at least 10 characters long.'
                                            },
                                            maxLength: {
                                                value: 500,
                                                message: 'Description must be less than 500 characters long.'
                                            }
                                        })}
                                    ></textarea>
                                    {errors.description && (
                                        <small className="text-danger">{errors.description.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <FormGroup>
                                    <Label for="purpose">Purpose</Label>
                                    <textarea
                                        id="purpose"
                                        className={`form-control ${classnames({ 'is-invalid': errors.purpose })}`}
                                        {...register('purpose', {
                                            required: 'Purpose is required.',
                                            minLength: {
                                                value: 10,
                                                message: 'Purpose must be at least 10 characters long.'
                                            },
                                            maxLength: {
                                                value: 500,
                                                message: 'Purpose must be less than 500 characters long.'
                                            }
                                        })}
                                    ></textarea>
                                    {errors.purpose && (
                                        <small className="text-danger">{errors.purpose.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                        </Row>
                        <Row className="mt-4">
                            <Col>
                                <Button
                                    type="submit"
                                    color="primary"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Submitting..." : "Create Donation Item"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </div>
    )
}

export default DonationItemCreate;