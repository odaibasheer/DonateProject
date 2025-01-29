/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import classnames from "classnames";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetItemQuery, useUpdateItemMutation } from "../../redux/api/itemAPI";

const DonationItemUpdate = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the item ID from the route
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm();

    const { data: itemData, isLoading: isFetching } = useGetItemQuery(id);
    const [updateItem, { isLoading, isError, error, isSuccess, data }] = useUpdateItemMutation();

    useEffect(() => {
        if (itemData) {
            // Pre-fill the form with existing data
            setValue("type", itemData.type);
            setValue("quantity", itemData.quantity);
            setValue("description", itemData.description);
            setValue("purpose", itemData.purpose);
        }
    }, [itemData, setValue]);

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

            await updateItem({ id, item: form });
        } catch (error) {
            toast.error("Error updating the donation item.");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Item updated successfully!");
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
                    <h3 className="mb-3">Update Donation Item</h3>
                </Col>
            </Row>
            <Card>
                <CardBody>
                    {isFetching ? (
                        <p>Loading item data...</p>
                    ) : (
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
                                            {...register("image")}
                                        />
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
                                        {isLoading ? "Updating..." : "Update Donation Item"}
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    )}
                </CardBody>
            </Card>
        </div>
    );
};

export default DonationItemUpdate;
