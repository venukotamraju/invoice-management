import React, { useEffect, useState, } from "react";
import { MDBDataTableV5 } from "mdbreact";
import { useNavigate } from "react-router-dom";
import {Button} from "@mui/material"
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { blue, red } from "@mui/material/colors";
import "./viewcustomers.css"
function ViewCustomers() {
  const [customersTableBody, setCustomersTableBody] = useState();
  const [loading, setLoading] = useState(true);
  const [reRenderOnDelete,setReRenderOnDelete] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    async function getCustomersData() {
      const customersDataFetch = await fetch(
        "http://localhost:4001/customerEntries"
      );
      const customersData = await customersDataFetch.json();
      
      setCustomersTableBody(
        customersData["rows"].map((customer) => ({
          firstName: customer["customer_first_name"],
          lastName: customer["customer_last_name"],
          dateOfBirth: customer["customer_dob"].slice(0,10),
          address: customer["customer_address"],
          description: customer["customer_description"],
          referenceId: customer["customer_reference_id"],
          generateNewInvoice: (<Button style={{cursor:"pointer",marginLeft:30}} onClick={()=>navigate("/lineItems",{state:{custRefId:customer["customer_reference_id"]}})}><AddCircleIcon sx={{color:blue["A200"],fontSize:30}} /></Button>),
          delete:(<Button style={{cursor:"pointer"}} onClick={()=>{deleteFunction(customer["customer_id"]);setReRenderOnDelete(!reRenderOnDelete)}}><DeleteOutlineIcon sx={{color:red["A400"],fontSize:30}}/></Button>)
        }))
      );
    }
    getCustomersData();
  }, [reRenderOnDelete]);
  const deleteFunction = (customerId) =>{
    fetch(`http://localhost:4001/customerEntries/customerId/${customerId}`,{
      method:"DELETE",
    });
  }
  const TableComponent = ({ tableData }) => {
    const [dataTable, setDataTable] = useState({
      columns: [
        {
          label: "First Name",
          field: "firstName",
          width: 150,
          attributes: {
            "aria-controls": "DataTable",
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
          width: 270,
        },
        {
          label: "Address",
          field: "address",
          width: 270,
        },
        {
          label: "Description",
          field: "description",
          width: 270,
        },
        {
          label: "Reference Id",
          field: "referenceId",
          width: 300,
        },
        {
          label: "Generate New Invoice",
          field: "generateNewInvoice",
          width: 200,
        },
        {
          label:"Delete",
          field: "delete",
          width:100,
        },
      ],
      rows: tableData,
    });
    return (
      <MDBDataTableV5
        hover
        entriesOptions={[5, 10, 25]}
        entries={5}
        pagesAmount={4}
        data={dataTable}
        className="customers-table"
      />
    );
  };
  setTimeout(() => {
    setLoading(false);
  }, 400);
  return loading ? (
    <>Loading...</>
  ) : (
    <div>
      <TableComponent tableData={customersTableBody} />
    </div>
  );
}

export default ViewCustomers;