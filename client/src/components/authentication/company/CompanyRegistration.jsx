import React, { useState } from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Link,
  Typography,
} from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import ContactsIcon from "@mui/icons-material/Contacts";
import WarningIcon from "@mui/icons-material/Warning";
import { green } from "@mui/material/colors";
import EmailIcon from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
function CompanyRegistration() {
  const [status, setStatus] = useState(false);
  const initialValues = {
    companyName: "",
    companyAddress: "",
    companyContactNo: "",
    companyGstNo: "",
    companyEmail: "",
    companyPassword: "",
  };
  const validations = (values) => {
    const errors = {};
    if (!values.companyName) {
      errors.companyName = "Field Required";
    }
    if (!values.companyAddress) {
      errors.companyAddress = "Field Required";
    }
    if (!values.companyContactNo) {
      errors.companyContactNo = "Field Required";
    } else if (
      !(
        values.companyContactNo.match(/^(\+\d{1,3}[- ]?)?\d{10}$/) &&
        !values.companyContactNo.match(/0{5,}/)
      )
    ) {
      errors.companyContactNo = "Enter valid no.";
    }
    if (!values.companyGstNo) {
      errors.companyGstNo = "Field Required";
    }
    if (!values.companyEmail) {
      errors.companyEmail = "Field Required";
    }
    if (!values.companyPassword) {
      errors.companyPassword = "Field Required";
    }
    return errors;
  };
  const handleSubmit = (values) => {
    fetch("http://localhost:4001/registerCompany", {
      method: "post",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.err) {
          console.error("received error from database entry: ", data.err);
        }
        if (data.status === 200) {
          setStatus(true);
        }
      })
      .catch((err) =>
        console.error("error from posting to registerCompany: ", err)
      );
  };
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      flexDirection={"column"}
      marginBottom={7}
    >
      <Box>
        <Typography variant="h5" component={"div"} m={2} p={2}>
          Registered? <Link href="/login">Login</Link> to your company account
        </Typography>
      </Box>
      <Card raised>
        <Formik
          initialValues={initialValues}
          validate={validations}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
            resetForm();
          }}
        >
          <Form>
            <CardContent>
              <Box my={2.5} p={0.5}>
                <label htmlFor="companyName">
                  <BusinessIcon />
                  <Typography mx={1}>Company Name</Typography>
                </label>
                <Field name="companyName" />
                <ErrorMessage
                  name="companyName"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
              <Box my={2.5} p={0.5}>
                <label htmlFor="companyAddress">
                  <BusinessIcon />
                  <Typography mx={1}>Address</Typography>
                </label>
                <Field name="companyAddress" />
                <ErrorMessage
                  name="companyAddress"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
              <Box my={2.5} p={0.5}>
                <label htmlFor="companyContactNo">
                  <ContactsIcon />
                  <Typography mx={1}>Contact No.</Typography>
                </label>
                <Field name="companyContactNo" />
                <ErrorMessage
                  name="companyContactNo"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
              <Box my={2.5} p={0.5}>
                <label htmlFor="companyGstNo">
                  <BusinessIcon />
                  <Typography mx={1}>Company GST No.</Typography>
                </label>
                <Field name="companyGstNo" />
                <ErrorMessage name="companyGstNo" />
                <ErrorMessage
                  name="companyGstNo"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
              <Box my={2.5} p={0.5} display={"flex"} alignItems={"center"}>
                <WarningIcon color="warning" fontSize="large" />
                <Typography
                  variant="body1"
                  component={"p"}
                  mx={1}
                  p={""}
                  width={"20rem"}
                >
                  The details entered above will be displayed on the invoice.
                </Typography>
              </Box>
              <Box my={2.5} p={0.5}>
                <label htmlFor="companyEmail">
                  <EmailIcon />
                  <Typography mx={1}>E-mail</Typography>
                </label>
                <Field name="companyEmail" type="email" />
                <ErrorMessage
                  name="companyEmail"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
              <Box my={2.5} p={0.5}>
                <label htmlFor="companyPassword">
                  <KeyIcon />
                  <Typography mx={1}>Key</Typography>
                </label>
                <Field name="companyPassword" type="password" />
                <ErrorMessage
                  name="companyPassword"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
            </CardContent>
            <CardActions>
              <Box width={"100%"} textAlign={"center"}>
                <Button type="submit">Register Company</Button>
              </Box>
            </CardActions>
          </Form>
        </Formik>
      </Card>

      <Typography
        component={"div"}
        variant="body1"
        m={3}
        fontWeight={600}
        color={green["A700"]}
        display={status ? "block" : "none"}
      >
        Registration success
      </Typography>
    </Box>
  );
}

export default CompanyRegistration;
