import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import {
  Button,
  Box,
  Card,
  Typography,
  CardContent,
  CardActions,
  Link,
} from "@mui/material";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import Key from "@mui/icons-material/Key";

function SignUp() {
  const handleSubmit = (values) => {
    console.log(values);
  }
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      alignItems={"center"}
      justifyContent={"center"}
      // minHeight={"70vh"}
      border={"solid"}
    >
      <Typography variant="h5" component={"p"} gutterBottom>
        Create New Employee Account
      </Typography>
      <Card raised>
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
          }}
          validate={(values) => {
            const errors = {};
            if (!values.firstName) {
              errors.firstName = "Field Required";
            }
            if (!values.lastName) {
              errors.lastName = "Field Required";
            }
            if (!values.email) {
              errors.email = "Field Required";
            }
            if (!values.password) {
              errors.password = "Field Required";
            }
            return errors;
          }}
          onSubmit={handleSubmit}
        >
          <Form>
            <CardContent>
              <Box>
                <label htmlFor="firstName">
                  <Typography variant="subtitle1" component={"p"} gutterBottom>
                    <PersonOutlineIcon />
                    First Name
                  </Typography>
                </label>
                <Field name="firstName" />
                <ErrorMessage
                  name="firstName"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
              <Box>
                <label htmlFor="lastName">
                  <Typography variant="subtitle1" component={"p"} gutterBottom>
                    <PersonOutlineIcon />
                    Last Name
                  </Typography>
                </label>
                <Field name="lastName" />
                <ErrorMessage
                  name="lastName"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
              <Box>
                <label htmlFor="email">
                  <EmailOutlinedIcon />
                </label>
                <Field name="email" type="email" />
                <ErrorMessage
                  name="email"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
              <Box>
                <label htmlFor="password">
                  <Key />
                </label>
                <Field name="password" type="password" />
                <ErrorMessage
                  name="password"
                  component={"div"}
                  className="errorMessage"
                />
              </Box>
            </CardContent>
            <CardActions>
              <Box width={"100%"} textAlign={"center"}>
                <Button type="submit">Sign Up</Button>
              </Box>
            </CardActions>
          </Form>
        </Formik>
      </Card>
      <Typography variant="body1" component={"div"} m={4}>Already have an account?<Link href="/login" component={"p"} mx={1}>Login</Link></Typography>
    </Box>
  );
}

export default SignUp;
