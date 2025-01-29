import { Card, CardBody, CardTitle, Col, Row } from "reactstrap";
import { useGetInventoriesQuery, useGetInventoriyItemsQuery } from "../../redux/api/inventoryAPI";
import { useEffect } from "react";
import FullScreenLoader from "../../components/FullScreenLoader";
import { Box, Package, ShoppingCart, Heart, Gift, Layers, ChevronDown } from "react-feather";
import DataTable from "react-data-table-component";
import { getDateFormat } from "../../utils/Utils";

const AdminInventory = () => {
    const { data: inventoryData, refetch, isLoading } = useGetInventoriesQuery();
    const { data: inventoryItemData, refetch: refetchItem, isLoading: isLoadingItem } = useGetInventoriyItemsQuery();

    console.log(inventoryItemData)

    useEffect(() => {
        refetch();
        refetchItem();
    }, [refetch, refetchItem]);

    if (isLoading || isLoadingItem) {
        return <FullScreenLoader />;
    }

    const renderImage = (image) => (
        <img
            src={image}
            alt="Item"
            className="img-fluid"
            style={{ maxWidth: "50px", maxHeight: "50px" }}
        />
    );

    // Function to generate random background colors
    const getRandomBgColor = () => {
        const colors = ["bg-primary", "bg-success", "bg-danger", "bg-warning", "bg-info", "bg-dark"];
        return colors[Math.floor(Math.random() * colors.length)];
    };

    // Function to assign icons based on the type
    const getIconForType = (type) => {
        switch (type) {
            case "Money":
                return <Box size={30} />;
            case "Clothes":
                return <ShoppingCart size={30} />;
            case "Food":
                return <Package size={30} />;
            case "Medical Supplies":
                return <Heart size={30} />;
            case "Furniture":
                return <Gift size={30} />;
            default:
                return <Layers size={30} />;
        }
    };

    const columns = [
        {
            name: "",
            width: "100px",
            cell: (row) => renderImage(row.image),
        },
        {
            name: "Donation Type",
            selector: (row) => row.type,
            sortable: true,
        },
        {
            name: "Quantity",
            selector: (row) => row.quantity,
            sortable: true,
        },
        {
            name: "CreatedBy",
            selector: (row) => row.createdBy?.username,
            sortable: true,
        },
        {
            name: "Last Updated",
            selector: (row) => getDateFormat(row.updatedAt),
            sortable: true,
        },
    ];

    return (
        <div className="main-view container">
            <Row className="my-3">
                <Col>
                    <h3 className="mb-3">Inventory</h3>
                </Col>
            </Row>
            <Row className="mt-3">
                {inventoryData.map((inventory, index) => (
                    <Col md="2" key={index} className="mb-3">
                        <Card className={`text-white text-center ${getRandomBgColor()}`}>
                            <CardBody>
                                <div className="icon-container mb-3" style={{ fontSize: "2rem" }}>
                                    {getIconForType(inventory.type)}
                                </div>
                                <CardTitle tag="h5">{inventory.type}</CardTitle>
                                <h2>{inventory.totalQuantity}</h2>
                            </CardBody>
                        </Card>
                    </Col>
                ))}
            </Row>
            <Row className="mt-3">
                <Col>
                    <Card>
                        <DataTable
                            title="Items"
                            data={inventoryItemData || []}
                            responsive
                            className="react-dataTable"
                            noHeader
                            pagination
                            paginationRowsPerPageOptions={[15, 30, 50, 100]}
                            columns={columns}
                            sortIcon={<ChevronDown />}
                            highlightOnHover
                            progressPending={isLoading} // Show loader while fetching
                        />
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

export default AdminInventory;
