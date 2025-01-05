/* eslint-disable react-hooks/exhaustive-deps */
import { useForm } from "react-hook-form";
import { Button, Card, CardBody, Col, Form, FormGroup, Label, Row } from "reactstrap";
import classnames from "classnames";
import { useCreateAssistanceMutation } from "../../redux/api/assistanceAPI"; // Adjusted import for assistance API
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NeedyAssistanceItemCreate = () => {
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
    } = useForm();

    const [createAssistance, { isLoading, isError, error, isSuccess, data }] = useCreateAssistanceMutation();

    const onSubmit = async (formData) => {
        try {
            const dataToSubmit = new FormData();

            dataToSubmit.append("type", formData.type);
            dataToSubmit.append("description", formData.description);
            formData.supporting_document && dataToSubmit.append("supporting_document", formData.supporting_document[0]);

            await createAssistance(dataToSubmit);
        } catch (error) {
            toast.error("Error submitting the assistance data.");
        }
    };

    useEffect(() => {
        if (isSuccess) {
            toast.success(data?.message || "Assistance created successfully!");
            navigate("/needy/assistance-items");
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
                    <h3 className="mb-3">Create Needy Assistance Item</h3>
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
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Submitting..." : "Create Assistance Item"}
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </CardBody>
            </Card>
        </div>
    )
}

export default NeedyAssistanceItemCreate;
