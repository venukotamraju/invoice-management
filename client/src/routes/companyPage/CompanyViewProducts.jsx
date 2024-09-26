import { Box, Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import { CompanyInfoContext } from "./CompanyHome";
import { MDBDataTableV5 } from "mdbreact";
import DeleteOutline from "@mui/icons-material/DeleteOutline";

function CompanyViewProducts() {
  const [productTable, setProductTable] = useState();
  const [reRenderOnDelete, setReRenderOnDelete] = useState(false);
  const companyInfo = useContext(CompanyInfoContext);
  const handleDelete = (productId) => {
    fetch("http://localhost:4001/products", {
      method: "DELETE",
      body: JSON.stringify({ productId }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setReRenderOnDelete(!reRenderOnDelete);
      });
  };
  const tableData = {
    columns: [
      {
        label: "Name",
        field: "name",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Product Name",
        },
      },
      {
        label: "Unit Type",
        field: "unitType",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Product Unit Type",
        },
      },
      {
        label: "Unit Cost",
        field: "unitCost",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Product Unit Cost",
        },
      },
      {
        label: "Status",
        field: "status",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Product status",
        },
      },
      {
        label: "Available Quantity",
        field: "availableQuantity",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Product Available Quantity",
        },
      },
      {
        label: "Product Description",
        field: "description",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Product Description",
        },
      },
      {
        label: "Delete Product",
        field: "delete",
        attributes: {
          "aria-controls": "DataTable",
          "aria-label": "Delete Product",
        },
      },
    ],
    rows: (productData) =>
      productData.map((product) => ({
        name: product.product_name,
        unitType: product.product_unit_type,
        unitCost: product.product_unit_cost,
        status: String(product.product_status),
        availableQuantity: product.product_available_quantity,
        description: product.product_description,
        delete: (
          <Button
            startIcon={<DeleteOutline />}
            onClick={() => handleDelete(product.product_id)}
          >
            Remove Product
          </Button>
        ),
      })),
  };
  useEffect(() => {
    fetch(`http://localhost:4001/products/company/${companyInfo.company_id}`)
      .then((res) => res.json())
      .then((data) => {
        setProductTable({
          columns: tableData.columns,
          rows: tableData.rows(data),
        });
      })
      .catch((err) =>
        console.error("error from fetching products of the company: ", err)
      );
  }, [reRenderOnDelete]);

  return (
    <Box m={"10px"} textAlign={"center"}>
      <MDBDataTableV5
        hover
        entriesOptions={[5, 10, 25]}
        entries={10}
        pagesAmount={4}
        data={productTable}
      />
    </Box>
  );
}

export default CompanyViewProducts;
