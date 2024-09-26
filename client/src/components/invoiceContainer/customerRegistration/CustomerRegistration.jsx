import React from "react";
import { Formik, Field, Form, ErrorMessage } from "formik";
import "./customerRegistration.css";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { Button } from "@mui/material";



function CustomerRegistration() {
  const navigate = useNavigate();
  let referenceId = uuidv4();
  const CustomerRegistrationForm = () => {
    const initialValues = {
      customerFirstName: "",
      customerLastName: "",
      customerDob: "",
      customerAddress: "",
      customerDescription: "",
      customerReferenceId: "",
    };
    const validations = (values) => {
      const errors = {};
      if (!values.customerFirstName) {
        errors.customerFirstName = "Field Required!";
      }
      if (!values.customerLastName) {
        errors.customerLastName = "Field Required!";
      }
      if (!values.customerDob) {
        errors.customerDob = "Field Required!";
      }
      if (!values.customerAddress) {
        errors.customerAddress = "Field Required!";
      }
      if (!values.customerDescription) {
        errors.customerDescription = "Field Required!";
      }
      return errors;
    };
    const postData = async (data) => {
      fetch("http://localhost:4001/customerEntries", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((returnDataFetch)=>returnDataFetch.json()).then((returnData)=>navigate("/lineItems",{
        state:{
          custRefId:data.customerReferenceId,
          invoiceID:returnData["invoice_id"],
          flow:"customerRegistration"
        }
      }));
    };
    return (
      <>
      <h1 style={{ width:"60%", fontWeight:"400", marginInline:"auto", textAlign:"center", borderBottom:"1px solid black", padding:"10px"}}>Customer Registration</h1>
      <Formik
        initialValues={initialValues}
        validate={validations}
        onSubmit={(values, { resetForm }) => {
          referenceId = uuidv4();
          postData(values);
          resetForm();
          
        }}
      >
        {(formikProps) => {
          return (
            <Form className="fieldContainer">
              <div className="customerFirstName field">
              <label htmlFor="customerFirstName"  className="label">First Name</label>
              <Field type="text" name="customerFirstName" />
              <ErrorMessage
                name="customerFirstName"
                component={"span"}
                className="errorMessage"
              />
              </div>
              <div className="customerLastName field">
              <label htmlFor="customerLastName"  className="label">Last Name</label>
              <Field type="text" name="customerLastName" />
              <ErrorMessage
                name="customerLastName"
                component={"span"}
                className="errorMessage"
              />
              </div>
              <div className="customerDob field">
              <label htmlFor="customerDob" className="label">Date of Birth</label>
              <Field type="date" name="customerDob" />
              <ErrorMessage
                name="customerDob"
                component={"span"}
                className="errorMessage"
              />
              </div>
              <div className="customerAddress field">
              <label htmlFor="customerAddress" className="label">Address</label>
              <Field type="customerAddress" name="customerAddress" />
              <ErrorMessage
                name="customerAddress"
                component={"span"}
                className="errorMessage"
              />
              </div>
              <div className="customerDescription field">
              <label htmlFor="customerDescription" className="label">Description</label>
              <Field type="customerDescription" name="customerDescription" />
              <ErrorMessage
                name="customerDescription"
                component={"span"}
                className="errorMessage"
              />
              </div>
              <div className="customerReferenceId field">
              <label htmlFor="customerReferenceId" className="label">Reference ID</label>
              <Field name="customerReferenceId" disabled={true}>
                {(fieldProps) => {
                  const { form, field } = fieldProps;
                  form.values.customerReferenceId = referenceId;
                  return <input type="text" {...field} />;
                }}
              </Field>
              </div>
              <Button
               type="submit" className="button" sx={{borderRadius:"50%", marginBlock:"15px"}}><ArrowForwardIcon sx={{fontSize:"40px"}}/></Button>
            </Form>
          );
        }}
      </Formik>
      </>
    );
  };

    return (
      <div>
        <CustomerRegistrationForm />
      </div>
    );
}

export default CustomerRegistration;
