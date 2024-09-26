import React, { useContext, useEffect, useState } from "react";
import { Box, Button, IconButton } from "@mui/material";
import { CompanyInfoContext } from "./CompanyHome";
import { MDBDataTableV5 } from "mdbreact";
import DeleteOutline from "@mui/icons-material/DeleteOutline";
function CompanyEmployees() {
  const companyName = useContext(CompanyInfoContext).company_name;
  const [dataTable, setDataTable] = useState("");
  const [reRenderOnDelete, setReRenderOnDelete] = useState(false);
  useEffect(() => {
    fetch(`http://localhost:4001/employees/${companyName}`)
      .then((res) => res.json())
      .then((data) => {
        setDataTable({
          columns: [
            {
              label: "First Name",
              field: "firstName",
              width: 150,
              attributes: {
                "aria-controls": "Data Table for company employees",
                "aria-label": "First Name",
              },
            },
            {
              label: "Last Name",
              field: "lastName",
              width: 150,
            },
            {
              label: "Date of Birth",
              field: "dateOfBirth",
              width: 200,
            },
            {
              label: "Contact No.",
              field: "contact",
              width: 250,
            },
            {
              label: "Email",
              field: "email",
              width: 250,
            },
            {
              label: "Registration Id",
              field: "regId",
              width: 250,
            },
            {
              label: "Remove Employee",
              field: "delete",
              width: 150,
            },
          ],
          rows: data.result.map((emp) => ({
            firstName: emp["employee_first_name"],
            lastName: emp["employee_last_name"],
            dateOfBirth: emp["employee_dob"].slice(0, 10),
            contact: emp["employee_contact"],
            email: emp["employee_email"],
            regId: emp["employee_reg_id"],
            delete: (
              <IconButton
                color="error"
                onClick={() => {
                  deleteFunction(emp["employee_reg_id"]);
                  setReRenderOnDelete(!reRenderOnDelete);
                }}
              >
                <DeleteOutline />
              </IconButton>
            ),
          })),
        });
      })
      .catch((err) => console.error("error from fetching employees: ", err));
  }, [reRenderOnDelete]);
  const deleteFunction = (empId) => {
    try {
      fetch("http://localhost:4001/employee", {
        method: "DELETE",
        body: JSON.stringify({ regId: empId }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => console.log(data));
    } catch (error) {
      console.error("error from deleting employee: ", error);
    }
  };
  return (
    <Box m={"10px"} textAlign={"center"}>
      <MDBDataTableV5
        hover
        entriesOptions={[5, 10, 25]}
        entries={5}
        pagesAmount={4}
        data={dataTable}
      />
    </Box>
  );
}

export default CompanyEmployees;
