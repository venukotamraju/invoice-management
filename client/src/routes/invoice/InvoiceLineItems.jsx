import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardActions,
  CardContent,
  Button,
  Typography,
  CardHeader,
  TextField,
  MenuItem,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import { useLocation, useNavigate } from "react-router-dom";
function InvoiceLineItems() {
  const [products, setProducts] = useState({
    name: null,
    price: null,
  });
  const nav = useNavigate();
  const location = useLocation();
  console.log(location);
  useEffect(() => {
    !location.state
      ? nav("/employee/createInvoice")
      : fetch(
          `http://localhost:4001/products/company/${location.state?.company_id}`
        )
          .then((res) => res.json())
          .then((data) =>
            setProducts({
              ...products,
              names: data.map((item) => item.product_name),
              price: data,
            })
          )
          .catch((err) =>
            console.error("error from fetching product details: ", err)
          );
  }, []);
  const initialValues = {
    firstName: location.state?.customer_first_name,
    lastName: location.state?.customer_last_name,
    referenceId: location.state?.customer_reference_id,
    listItems: [
      {
        itemName: "",
        itemQuantity: 0,
        itemAmount: 0,
      },
    ],
  };
  const validations = (values) => {
    const errors = {};
    if (
      !values.listItems[0].itemName ||
      values.listItems[0].itemQuantity === 0
    ) {
      errors.listItems = "Enter atleast 1 item";
    }
    return errors;
  };
  const handleSubmit = (values) => {
    fetch(
      `http://localhost:4001/lineItemDetails/${
        location.state?.flow ? "insert" : "update"
      }`,
      {
        method: "POST",
        body: JSON.stringify({
          ...values,
          invoiceId: location.state?.invoiceId,
          customerId: location.state?.customer_id,
          companyId: location.state?.company_id,
        }),
        headers: {
          "Content-type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) =>
        nav("/employee/invoicePrint", {
          state: { ...data, customerDetails: location.state },
        })
      )
      .catch((err) => console.error("error from submitting line items: ", err));
  };
  return (
    <Box
      display={"flex"}
      width={"100%"}
      height={"80vh"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Formik
        initialValues={initialValues}
        validate={validations}
        onSubmit={(values, { resetForm }) => {
          handleSubmit(values);
          resetForm();
        }}
      >
        <Box width={"70%"}>
          <Form>
            <Card square>
              <CardHeader title="Billing" sx={{ textAlign: "center" }} />
              <CardContent>
                <Box display={"flex"} p={4} gap={4}>
                  <Field name="firstName">
                    {({ field }) => (
                      <TextField
                        label={"First Name"}
                        variant="standard"
                        size="small"
                        margin="dense"
                        disabled
                        fullWidth
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="lastName">
                    {({ field }) => (
                      <TextField
                        label="Last Name"
                        variant="standard"
                        size="small"
                        margin="dense"
                        disabled
                        fullWidth
                        {...field}
                      />
                    )}
                  </Field>
                  <Field name="referenceId">
                    {({ field }) => (
                      <TextField
                        label="Reference Id"
                        variant="standard"
                        size="small"
                        margin="dense"
                        fullWidth
                        disabled
                        {...field}
                      />
                    )}
                  </Field>
                </Box>
                <FieldArray name="listItems">
                  {({ form, push, remove }) => (
                    <Box p={4}>
                      {form.values.listItems.map((listItem, idx) => (
                        <Box key={listItem} display={"flex"} gap={2}>
                          <Box display={"flex"} gap={4} flex={1}>
                            <Field name={`listItems[${idx}].itemName`}>
                              {({ field }) => (
                                <TextField
                                  select
                                  label="Product"
                                  helperText="Select any item"
                                  required
                                  defaultValue={
                                    products.names ? products.names[0] : ""
                                  }
                                  margin="dense"
                                  fullWidth
                                  {...field}
                                >
                                  <MenuItem value="">
                                    {"Select any option"}
                                  </MenuItem>
                                  {products?.names?.map((option) => (
                                    <MenuItem key={option} value={option}>
                                      {option}
                                    </MenuItem>
                                  ))}
                                </TextField>
                              )}
                            </Field>
                            <Field name={`listItems[${idx}].itemQuantity`}>
                              {({ field }) => (
                                <TextField
                                  label="Quantity"
                                  helperText="Enter the quantity"
                                  type="number"
                                  margin="dense"
                                  required
                                  fullWidth
                                  {...field}
                                />
                              )}
                            </Field>
                            <Field name={`listItems[${idx}].itemAmount`}>
                              {({ field, form }) => {
                                if (
                                  form.values.listItems[idx].itemQuantity &&
                                  form.values.listItems[idx].itemName &&
                                  products.price
                                ) {
                                  field.value =
                                    form.values.listItems[idx].itemQuantity *
                                    products.price.filter(
                                      (ele) =>
                                        ele.product_name ===
                                        form.values.listItems[idx].itemName
                                    )[0].product_unit_cost;
                                  form.values.listItems[idx].itemAmount =
                                    field.value;
                                } else field.value = 0;
                                return (
                                  <TextField
                                    type="number"
                                    label="Total Cost"
                                    margin="dense"
                                    fullWidth
                                    {...field}
                                  />
                                );
                              }}
                            </Field>
                          </Box>
                          <Box
                            width={"11%"}
                            display={"flex"}
                            alignItems={"center"}
                          >
                            {idx > 0 && (
                              <IconButton
                                type="button"
                                onClick={() => remove(idx)}
                                size="large"
                                color="primary"
                              >
                                <RemoveIcon />
                              </IconButton>
                            )}
                            <IconButton
                              type="button"
                              size="large"
                              onClick={() => push("")}
                              color="primary"
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Box>
                      ))}
                    </Box>
                  )}
                </FieldArray>
                <Typography variant="caption" color={"error"}>
                  <ErrorMessage name="listItems" />
                </Typography>
              </CardContent>
              <CardActions>
                <Box width={"100%"} textAlign={"center"}>
                  <Button type="submit">Generate Invoice</Button>
                </Box>
              </CardActions>
            </Card>
          </Form>
        </Box>
      </Formik>
    </Box>
  );
}

export default InvoiceLineItems;
