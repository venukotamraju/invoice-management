import React, { useContext, useState } from "react";
import { CompanyInfoContext } from "./CompanyHome";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  MenuItem,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Field, Form, Formik } from "formik";
import { green } from "@mui/material/colors";

function CompanyAddProducts() {
  const companyInfo = useContext(CompanyInfoContext);
  const [submissionResult, setSubmissionResult] = useState();
  const initialValues = {
    name: "",
    unitType: "",
    unitCost: 0,
    status: false,
    availableQuantity: "",
    description: "",
  };
  const handleSubmit = (values, { resetForm }) => {
    fetch("http://localhost:4001/products", {
      method: "POST",
      body: JSON.stringify({ ...values, companyId: companyInfo.company_id }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setSubmissionResult(data))
      .catch((err) => console.error("error from posting product: ", err));
    resetForm();
  };
  return (
    <Box>
      <Box
        display={"flex"}
        justifyContent={"center"}
        alignItems="center"
        height={"80vh"}
      >
        <Card>
          <Stack divider={<Divider />}>
            <CardHeader title="Add Product" />
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              <Form>
                <CardContent>
                  <Box p={4}>
                    <Field name="name">
                      {({ field }) => (
                        <TextField
                          label="Product Name"
                          required
                          size="small"
                          fullWidth
                          {...field}
                        />
                      )}
                    </Field>
                  </Box>
                  <Box p={4} display={"flex"} gap={6}>
                    <Field name="unitType">
                      {({ field }) => (
                        <TextField
                          label="Unit Type"
                          required
                          select
                          size="small"
                          fullWidth
                          {...field}
                        >
                          {["g", "kg", "l", "ml", "units"].map((e) => (
                            <MenuItem key={e} value={e}>
                              {e}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    </Field>
                    <Field name="availableQuantity">
                      {({ field }) => (
                        <TextField
                          label="Quantity"
                          required
                          size="small"
                          type="number"
                          fullWidth
                          {...field}
                        />
                      )}
                    </Field>
                    <Field name="unitCost">
                      {({ field }) => (
                        <TextField
                          label="Cost"
                          required
                          size="small"
                          type="number"
                          fullWidth
                          {...field}
                        />
                      )}
                    </Field>
                    <Field name="status">
                      {({ field }) => (
                        <TextField
                          label="status"
                          required
                          select
                          size="small"
                          fullWidth
                          {...field}
                        >
                          {[true, false].map((e) => (
                            <MenuItem key={String(e)} value={e}>
                              {String(e)}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    </Field>
                  </Box>
                  <Box p={4}>
                    <Field name="description">
                      {({ field }) => (
                        <TextField
                          label="Description"
                          required
                          size="small"
                          fullWidth
                          {...field}
                        />
                      )}
                    </Field>
                  </Box>
                </CardContent>
                <CardActions>
                  <Box width={"100%"} textAlign={"center"}>
                    <Button type="submit">Add product</Button>
                  </Box>
                </CardActions>
              </Form>
            </Formik>
          </Stack>
          {submissionResult ? (
            <Box m={3} borderTop={"dashed"}>
              <Typography p={2} fontWeight={600} color={green["A700"]} textAlign={"center"} width={"100%"}>{submissionResult.message}</Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      {Object.keys(submissionResult.result[0]).map((e) => (
                        <TableCell component={"th"} key={e}>
                          {e}
                        </TableCell>
                      ))}
                    </TableRow>
                    {
                      console.log(submissionResult)
                    }
                  </TableHead>
                  <TableBody>
                    <TableRow>
                      {Object.values(submissionResult.result[0]).map((e) => (
                        <TableCell align="center" component={"td"} key={e}>
                          {String(e)}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          ) : null}
        </Card>
      </Box>
    </Box>
  );
}

export default CompanyAddProducts;
