import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  Link,
  Typography,
  Box,
  Card,
  Button,
  CardActions,
  CardContent,
} from "@mui/material";
import Email from "@mui/icons-material/Email";
import KeyIcon from "@mui/icons-material/Key";
import { grey } from "@mui/material/colors";
import WarningIcon from "@mui/icons-material/Warning";
function ReusableLoginComponent({ formName, onSubmit, user }) {
  const initialValues = {
    email: "",
    password: "",
  };
  const validations = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = "Field Required!";
    }
    if (!values.password) {
      errors.password = "Field Required!";
    }
    return errors;
  };
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      overflow={"hidden"}
    >
      <Typography
        variant="h5"
        component={"div"}
        m={3}
        fontWeight={600}
        color={grey["500"]}
      >
        {formName}
      </Typography>
      <Card raised>
        <Formik
          initialValues={initialValues}
          validate={validations}
          onSubmit={onSubmit}
        >
          <Form>
            <CardContent>
              <Box my={6}>
                <label htmlFor="email">
                  <Email />
                </label>
                <Field name="email" type="email" />
                <ErrorMessage
                  name="email"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
              <Box my={6}>
                <label htmlFor="password">
                  <KeyIcon />
                </label>
                <Field name="password" type="password"/>
                <ErrorMessage
                  name="password"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
            </CardContent>
            <CardActions>
              <Box width={"100%"} textAlign={"center"} p={1}>
                <Button type="submit" variant="contained">
                  Login
                </Button>
              </Box>
            </CardActions>
          </Form>
        </Formik>
      </Card>
      {user === "company" ? (
        <Box m={3}>
          <Typography>
            New Here?{" "}
            <Link fontSize={16} href="/home/signUp">
              Register
            </Link>{" "}
            your company
          </Typography>
        </Box>
      ) :<Box my={2.5} p={0.5} display={"flex"} alignItems={"center"}>
      <WarningIcon color="warning" fontSize="large" />
      <Typography
        variant="body1"
        component={"p"}
        mx={1}
        width={"20rem"}
      >
        Login details will be provided by your company
      </Typography>
    </Box> }
    </Box>
  );
}

export default ReusableLoginComponent;
