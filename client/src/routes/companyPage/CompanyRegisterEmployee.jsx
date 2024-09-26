import React, { useContext, useState } from "react";
import {
  Box,
  Card,
  Typography,
  Button,
  TextField,
  InputAdornment,
  IconButton,
  CardContent,
  CardActions,
  CardHeader,
} from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import EmailIcon from "@mui/icons-material/Email";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PasswordIcon from "@mui/icons-material/Password";
import { CompanyInfoContext } from "./CompanyHome";
import { green } from "@mui/material/colors";
function CompanyRegisterEmployee() {
  const contextInfo = useContext(CompanyInfoContext);
  const [submissionStatus,setSubmisisonStatus] = useState(null);
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const handleSubmit = (values) => {
    try {
      fetch("http://localhost:4001/employee", {
        method: "POST",
        body: JSON.stringify({ ...values, companyId: contextInfo.company_id }),
        headers: {
          "Content-type": "application/json",
        },
      })
      .then((res) => res.json())
        .then((data) => data?setSubmisisonStatus(data.message):null)
    } catch (error) {
      console.log("error from posting employee details: ", error);
    }
  };
  return (
    <Box
      m={"10px"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      my={10}
      flexDirection={"column"}
    >
      <Card
        raised
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <CardHeader title="Register Employee" titleTypographyProps={{}} />
        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            password: "",
            contactNo: "",
            id: "",
            dob: "",
          }}
          onSubmit={(values, { resetForm }) => {
            handleSubmit(values);
            resetForm();
          }}
          validate={(values) => {
            const errors = {};
            if (
              values.contactNo.length !== 10 ||
              !/^\d{10}$/.test(values.contactNo)
            ) {
              errors.contactNo = "enter valid number";
            }
            return errors;
          }}
        >
          <Form>
            <CardContent>
              <Box
                p={2}
                display={"flex"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Field name="firstName">
                  {(fieldProps) => (
                    <TextField
                      variant="standard"
                      required
                      label="first name"
                      {...fieldProps.field}
                    />
                  )}
                </Field>
                <Field name="lastName">
                  {(fieldProps) => (
                    <TextField
                      variant="standard"
                      required
                      label="last name"
                      {...fieldProps.field}
                    />
                  )}
                </Field>
              </Box>
              <Box
                my={3}
                p={2}
                display={"flex"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Field name="email">
                  {(fieldProps) => (
                    <TextField
                      variant="standard"
                      required
                      label={<EmailIcon fontSize="small" />}
                      type="email"
                      {...fieldProps.field}
                    />
                  )}
                </Field>
                <Field name="password">
                  {(fieldProps) => (
                    <TextField
                      sx={{ width: "50%" }}
                      variant="standard"
                      label={<PasswordIcon fontSize="small" />}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setPasswordVisibility(!passwordVisibility)
                              }
                              edge="end"
                              size="small"
                              sx={{ border: "none", borderRadius: "0px" }}
                            >
                              {passwordVisibility ? (
                                <VisibilityIcon
                                  fontSize="small"
                                  sx={{ border: "none" }}
                                />
                              ) : (
                                <VisibilityOffIcon
                                  fontSize="small"
                                  sx={{ border: "none" }}
                                />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      type={passwordVisibility ? "text" : "password"}
                      required
                      {...fieldProps.field}
                    />
                  )}
                </Field>
              </Box>
              <Box
                my={3}
                p={2}
                display={"flex"}
                justifyContent={"space-between"}
                width={"100%"}
              >
                <Field name="dob">
                  {(fieldProps) => (
                    <TextField
                      required
                      variant="standard"
                      type="date"
                      {...fieldProps.field}
                      label="date of birth"
                      InputLabelProps={{ shrink: true }}
                    />
                  )}
                </Field>
                <Box display={"flex"} flexDirection={"column"}>
                  <Field name="contactNo">
                    {(fieldProps) => (
                      <TextField
                        variant="standard"
                        label="contact no."
                        required
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              +91
                            </InputAdornment>
                          ),
                        }}
                        pattern="\d{10}"
                        {...fieldProps.field}
                      />
                    )}
                  </Field>
                  <Typography variant="caption" color={"error"}>
                    <ErrorMessage name="contactNo" />
                  </Typography>
                </Box>
              </Box>
              <Box my={3} p={2} width={"100%"}>
                <Field name="id">
                  {(fieldProps) => (
                    <TextField
                      sx={{ width: "90%" }}
                      required
                      variant="standard"
                      label="employee registration id"
                      {...fieldProps.field}
                    />
                  )}
                </Field>
              </Box>
            </CardContent>
            <CardActions>
              <Box textAlign={"center"} width={"100%"} p={1}>
                <Button type="submit">Register</Button>
              </Box>
            </CardActions>
          </Form>
        </Formik>
      </Card>
      {submissionStatus?<Box><Typography variant="caption" component={"p"} my={2} borderBottom={"dashed"} color={green["500"]} >{submissionStatus}</Typography></Box>:null}
    </Box>
  );
}

export default CompanyRegisterEmployee;
