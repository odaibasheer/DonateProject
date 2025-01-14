/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import classnames from "classnames";
import { useGetAssistanceQuery, useUpdateAssistanceMutation } from "../../redux/api/assistanceAPI"; // Adjusted import for assistance API
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import FullScreenLoader from "../../components/FullScreenLoader";

const NeedyAssistanceItemUpdate = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // Get the assistance item ID from the URL

    // Fetch existing assistance item by ID
    const { data: assistanceItem, isError, error, isLoading } = useGetAssistanceQuery(id);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [updateAssistance, { isLoading: isUpdating, isError: isUpdateError, error: updateError, isSuccess, data }] = useUpdateAssistanceMutation();

    useEffect(() => {
        if (assistanceItem) {
            // Set form values when data is fetched
            setValue("type", assistanceItem.type);
            setValue("status", assistanceItem.status);
            setValue("description", assistanceItem.description);
        }

        if (isError) {
            toast.error(error?.data?.message || "Error fetching assistance item.");
        }
    }, [assistanceItem, isError]);

    const onSubmit = async (formData) => {
        try {
            const dataToSubmit = new FormData();
            dataToSubmit.append("type", formData.type);
            dataToSubmit.append("description", formData.description);
            formData.supporting_document && dataToSubmit.append("supporting_document", formData.supporting_document[0]);

            await updateAssistance({ id, assistance: dataToSubmit });
        } catch (error) {
            toast.error("Error updating the assistance data.");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Assistance item updated successfully!");
            navigate("/needy/assistance-items");
        }

        if (isUpdateError) {
            const errorData = updateError?.data?.error;
            if (Array.isArray(errorData)) {
                errorData.forEach((el) => toast.error(el.message, { position: "top-right" }));
            } else {
                toast.error(updateError?.data?.message || "An unexpected error occurred!", {
                    position: "top-right",
                });
            }
        }
    }, [isUpdating]);

    if (isLoading) {
        return (<FullScreenLoader />);
    }

    return (
        <div className="container main-view">
            <Row className="my-3">
                <Col>
                    <h3 className="mb-3">Update Needy Assistance Item</h3>
                </Col>
            </Row>
            <Card>
                <CardBody>
                    <Form onSubmit={handleSubmit(onSubmit)}>
                        <Row>
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="type">Assistance Type</Label>
                                    <select
                                        className={`form-control ${classnames({
                                            "is-invalid": errors.type,
                                        })}`}
                                        {...register("type", { required: "Assistance Type is required." })}
                                    >
                                        <option value="">Select...</option>
                                        <option value="Money">Money</option>
                                        <option value="Clothes">Clothes</option>
                                        <option value="Food">Food</option>
                                        <option value="Medical Supplies">Medical Supplies</option>
                                        <option value="Furniture">Furniture</option>
                                        <option value="Financial Support">Financial Support</option>
                                        <option value="Legal Aid">Legal Aid</option>
                                        <option value="Other">Other</option>
                                    </select>

                                    {errors.type && (
                                        <small className="text-danger">{errors.type.message}</small>
                                    )}
                                </FormGroup>
                            </Col>
                            
                        
                            <Col md={6}>
                                <FormGroup>
                                    <Label for="supporting_document">Supporting Document</Label>
                                    <input
                                        className={`form-control ${classnames({
                                            "is-invalid": errors.supporting_document,
                                        })}`}
                                        id="supporting_document"
                                        type="file"
                                        accept=".pdf, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .txt"
                                        {...register("supporting_document")}
                                    />
                                    {errors.supporting_document && (
                                        <small className="text-danger">{errors.supporting_document.message}</small>
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
                        
                        <Row className="mt-4">
                            <Col>
                                <Button
                                    type="submit"
                                    color="primary"
                                    disabled={isUpdating}
                                >
                                    {isUpdating ? "Updating..." : "Update Assistance Item"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </div>
    );
};

export default NeedyAssistanceItemUpdate;
