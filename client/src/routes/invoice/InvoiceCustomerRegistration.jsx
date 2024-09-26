import React, { useContext } from "react";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  CardHeader,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { Formik, Field, Form, ErrorMessage } from "formik";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { EmployeeInfoContext } from "../employeePage/EmployeeHome";
function InvoiceCustomerRegistration() {
  const nav = useNavigate();
  let referenceId = uuidv4();
  const employeeInfo = useContext(EmployeeInfoContext);
  const initialValues = {
    customerFirstName: "",
    customerLastName: "",
    customerDob: "",
    customerAddress: "",
    customerDescription: "",
    customerReferenceId: "",
    customerContactNo: "",
  };
  const handleSubmit = (data) => {
    fetch("http://localhost:4001/customerEntries", {
      method: "POST",
      body: JSON.stringify({ ...data, companyId: employeeInfo.company_id }),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) =>
        data
          ? nav("/employee/lineItems", {
              state: { ...data, companyId: employeeInfo.company_id },
            })
          : null
      )
      .catch((err) => console.error("error from registering customer: ", err));
  };
  const validate = (values) => {
    const errors = {};
    if (
      values.customerContactNo.length !== 10 ||
      !/^\d{10}$/.test(values.customerContactNo)
    ) {
      errors.customerContactNo = "Enter valid number!";
    }
    return errors;
  };
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      justifyContent={"center"}
      alignItems={"center"}
      height={"90vh"}
    >
      <Formik
        initialValues={initialValues}
        onSubmit={(values, { resetForm }) => {
          console.log(values);
          referenceId = uuidv4();
          handleSubmit(values);
          resetForm();
        }}
        validate={validate}
      >
        <Card square sx={{ width: "60%" }} raised>
          <CardHeader
            title="Customer Registration"
            sx={{ textAlign: "center" }}
          />
          <Form>
            <CardContent sx={{ display: "flex", flexDirection: "column" }}>
              <Box display={"flex"} p={4} gap={10}>
                <Field name="customerFirstName">
                  {({ field }) => (
                    <TextField
                      required
                      label="First Name"
                      size="large"
                      margin="dense"
                      variant="standard"
                      fullWidth
                      {...field}
                    />
                  )}
                </Field>
                <Field name="customerLastName">
                  {({ field }) => (
                    <TextField
                      required
                      label="Last Name"
                      size="large"
                      margin="dense"
                      variant="standard"
                      fullWidth
                      {...field}
                    />
                  )}
                </Field>
                <Field name="customerDob">
                  {({ field }) => (
                    <TextField
                      required
                      label="Date of birth"
                      type="date"
                      size="large"
                      margin="dense"
                      variant="standard"
                      fullWidth
                      InputLabelProps={{ shrink: true }}
                      {...field}
                    />
                  )}
                </Field>
              </Box>
              <Box
                display={"flex"}
                justifyContent={"space-between"}
                gap={4}
                p={4}
              >
                <Box display={"flex"} flexDirection={"column"}>
                  <Field name="customerContactNo">
                    {({ field }) => (
                      <TextField
                        required
                        label="Contact no"
                        size="big"
                        margin="dense"
                        variant="standard"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              +91
                            </InputAdornment>
                          ),
                        }}
                        {...field}
                      />
                    )}
                  </Field>
                  <Typography variant="caption" color={"error"}>
                    <ErrorMessage name="customerContactNo" />
                  </Typography>
                </Box>
                <Field name="customerAddress">
                  {({ field }) => (
                    <TextField
                      required
                      label="Address"
                      size="big"
                      margin="dense"
                      variant="standard"
                      fullWidth
                      {...field}
                    />
                  )}
                </Field>
              </Box>
              <Box display={"flex"} flexDirection={"column"} p={4} gap={5}>
                <Field name="customerReferenceId">
                  {({ field, form }) => {
                    form.values.customerReferenceId = referenceId;
                    return (
                      <TextField
                        label="Reference Id"
                        size="small"
                        margin="dense"
                        {...field}
                      />
                    );
                  }}
                </Field>
                <Field name="customerDescription">
                  {({ field }) => (
                    <TextField
                      required
                      label="Description"
                      fullWidth
                      margin="dense"
                      {...field}
                    />
                  )}
                </Field>
              </Box>
            </CardContent>
            <CardActions>
              <Box textAlign={"center"} width={"100%"}>
                <Button type="submit">Register</Button>
              </Box>
            </CardActions>
          </Form>
        </Card>
      </Formik>
    </Box>
  );
}

export default InvoiceCustomerRegistration;
