import React, { useContext } from "react";
import {
  Box,
  Table,
  TableContainer,
  TableRow,
  TableCell,
  Paper,
  TableHead,
  TableBody,
} from "@mui/material";
import { CompanyInfoContext } from "./CompanyHome";
function CompanySection() {
  const companyInfo = useContext(CompanyInfoContext);
  if (companyInfo) {
    console.log(companyInfo);
    return (
      <Box
        display={"flex"}
        height={"80vh"}
        m={"10px"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <TableContainer component={Paper} sx={{ width: "70%" }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell colSpan={2} align="center">
                  COMPANY INFO
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <TableRow>
                <TableCell>Company Name</TableCell>
                <TableCell>{companyInfo.company_name}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Company Email</TableCell>
                <TableCell>{companyInfo.company_email}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Company Gst Number</TableCell>
                <TableCell>{companyInfo.company_gst_no}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Company Address</TableCell>
                <TableCell>{companyInfo.company_address}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Company Contact Number</TableCell>
                <TableCell>{companyInfo.company_contact_no}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    );
  }
}
export default CompanySection;
