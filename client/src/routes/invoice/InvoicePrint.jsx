import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  InputAdornment,
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
import PrintIcon from "@mui/icons-material/Print";
import { Field, Formik, Form } from "formik";
import React, { useContext, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { EmployeeInfoContext } from "../employeePage/EmployeeHome";
import ReactToPrint from "react-to-print";

function InvoicePrint() {
  const location = useLocation();
  const [companyInfo, setCompanyInfo] = useState();
  const [finalDetails, setFinalDetails] = useState(
    location.state?.invoiceTable?.generated_date
      ? {
          date: location.state.invoiceTable.generated_date.slice(0, 10),
          dueDate: location.state.invoiceTable.due_date.slice(0, 10),
          tax: location.state.invoiceTable.tax,
          finalAmount: location.state.invoiceTable.final_amount,
        }
      : {}
  );
  const employeeInfo = useContext(EmployeeInfoContext);
  const nav = useNavigate();
  const componentReference = useRef();
  console.log(location);
  useEffect(() => {
    !location.state
      ? nav("/employee/createInvoice")
      : fetch(
          `http://localhost:4001/registerCompany/companyId/${location.state.invoiceTable.company_id}`
        )
          .then((res) => res.json())
          .then((data) => setCompanyInfo(data))
          .catch((err) =>
            console.error("error from fetching company data: ", err)
          );
  }, []);
  console.log(companyInfo);
  const initialValues = {
    date: "",
    dueDate: "",
    tax: 0,
  };
  const handleSubmit = (values) => {
    if (!location.state?.invoiceTable?.generated_date) {
      fetch("http://localhost:4001/invoices/date", {
        method: "POST",
        body: JSON.stringify({
          ...values,
          finalAmount:
            parseInt(location.state.invoiceTable.total_amount) +
            parseInt(location.state.invoiceTable.total_amount) *
              (values.tax / 100),
          invoiceId: location.state.invoiceTable.invoice_id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => console.log(data))
        .catch((err) =>
          console.error("error from posting to update dates: ", err)
        );
      setFinalDetails({
        ...finalDetails,
        date: values.date,
        dueDate: values.dueDate,
        tax: values.tax,
        finalAmount:
          parseInt(location.state.invoiceTable.total_amount) +
          parseInt(location.state.invoiceTable.total_amount) *
            (values.tax / 100),
      });
    }
  };
  if (companyInfo) {
    return (
      <Box>
        <Stack divider={<Divider />}>
          <Box
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            m={10}
          >
            <Card>
              <CardHeader title="Print Invoice" />
              <Formik
                initialValues={initialValues}
                onSubmit={(values) => {
                  console.log(values);
                  handleSubmit(values);
                }}
              >
                <Form>
                  <CardContent>
                    <Box display={"flex"} gap={6} p={4}>
                      <Field name="date">
                        {({ field }) => {
                          return (
                            <TextField
                              type="date"
                              label="Date"
                              fullWidth
                              InputLabelProps={{ shrink: true }}
                              {...field}
                            />
                          );
                        }}
                      </Field>
                      <Field name="dueDate">
                        {({ field }) => (
                          <TextField
                            type="date"
                            label="Due Date"
                            required
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                            {...field}
                          />
                        )}
                      </Field>
                      <Field name="tax">
                        {({ field }) => (
                          <TextField
                            type="number"
                            label="Tax"
                            required
                            fullWidth
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">
                                  %
                                </InputAdornment>
                              ),
                            }}
                            {...field}
                          />
                        )}
                      </Field>
                    </Box>
                  </CardContent>
                  <CardActions>
                    <Box width={"100%"} textAlign={"center"}>
                      <Button type="submit" disabled={finalDetails.tax}>continue</Button>
                    </Box>
                  </CardActions>
                </Form>
              </Formik>
            </Card>
          </Box>
          <Box ref={componentReference}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="center" colSpan={4}>
                      <Typography textTransform={"uppercase"}>
                        Tax Invoice
                      </Typography>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={4} align="center">
                      <Box display={"flex"} flexDirection={"column"} gap={1.5}>
                        <Typography variant="h4" textTransform={"uppercase"}>
                          {companyInfo.company_name}
                        </Typography>
                        <Typography>{companyInfo.company_address}</Typography>
                        <Typography>
                          Phone:{companyInfo.company_contact_no}, Email:
                          {companyInfo.company_email}
                        </Typography>
                        <Typography>
                          GSTIN: {companyInfo.company_gst_no}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>
                      <Typography>Bill to: </Typography>
                      <Box display={"flex"} flexDirection={"column"} gap={2}>
                        <Typography fontWeight={600}>
                          {location.state.customerDetails.customer_first_name}{" "}
                          {location.state.customerDetails.customer_last_name}
                        </Typography>
                        <Typography>
                          Phone:{" "}
                          {location.state.customerDetails.customer_contact_no}
                        </Typography>
                        <Typography>
                          {location.state.customerDetails.customer_address}
                        </Typography>
                        <Typography fontWeight={300}>
                          Ref-Id:{" "}
                          {location.state.customerDetails.customer_reference_id}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell colSpan={3}>
                      <Box display="flex" flexDirection={"column"} gap={2}>
                        <Typography fontWeight={600}>
                          Inovice No. : {location.state.invoiceTable.invoice_id}
                        </Typography>
                        <Typography>
                          Invoice Date : {finalDetails?.date}
                        </Typography>
                        <Typography>
                          GSTIN: {companyInfo.company_gst_no}
                        </Typography>
                        <Typography mb={4}>
                          Due Date : {finalDetails?.dueDate}
                        </Typography>
                        <Typography>
                          SR :{" "}
                          {employeeInfo.employee_first_name +
                            " " +
                            employeeInfo.employee_last_name}{" "}
                          // {employeeInfo.employee_contact}
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell align="center" colSpan={3}>
                      Details
                    </TableCell>
                    <TableCell align="right">Price</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Desc</TableCell>
                    <TableCell align="right">Qty</TableCell>
                    <TableCell align="right">Unit</TableCell>
                    <TableCell align="right">Sum</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {location.state.lineItemsTable.map((item) => (
                    <TableRow key={item.line_id}>
                      <TableCell>{item.line_item}</TableCell>
                      <TableCell align="right">
                        {item.line_item_quantity}
                      </TableCell>
                      <TableCell align="right">
                        {parseInt(item.line_amount) / item.line_item_quantity}
                      </TableCell>
                      <TableCell align="right">
                        {parseInt(item.line_amount)}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell rowSpan={3} />
                    <TableCell colSpan={2}>Subtotal</TableCell>
                    <TableCell align="right">
                      {parseInt(location.state.invoiceTable.total_amount)}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Tax</TableCell>
                    <TableCell align="right">{finalDetails?.tax}%</TableCell>
                    <TableCell align="right">
                      {finalDetails?.tax
                        ? (
                            location.state.invoiceTable.total_amount *
                            (finalDetails?.tax / 100)
                          ).toFixed(2)
                        : "-"}
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={2}>Total</TableCell>
                    <TableCell align="right">
                      {finalDetails?.finalAmount}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
        <Box width={"100%"} textAlign={"center"} p={4}>
          <ReactToPrint
            trigger={() => (
              <Button disabled={!finalDetails?.tax} startIcon={<PrintIcon />}>
                Generate/Print
              </Button>
            )}
            content={() => componentReference.current}
          />
        </Box>
      </Box>
    );
  }
}
export default InvoicePrint;
