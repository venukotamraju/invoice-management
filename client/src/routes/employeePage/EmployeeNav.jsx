import React, { useContext } from "react";
import { EmployeeInfoContext } from "./EmployeeHome";
import { PropTypes } from "prop-types";
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import PageviewIcon from "@mui/icons-material/Pageview";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import { NavLink, useNavigate } from "react-router-dom";
function EmployeeNav() {
  const nav = useNavigate();
  const employeeInfo = useContext(EmployeeInfoContext);
  const handleClick = () => {
    fetch("http://localhost:4001/logout/employee", {
      credentials: "include",
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => (data.message?.logOut ? nav("/home/login") : null))
      .catch((err) => console.error("error from logging out: ", err));
  };
  return (
    <Box m={"10px"}>
      <AppBar position="static">
        <Toolbar>
          <Box flexGrow={1}>
            <IconButton
              title="create invoice"
              color="inherit"
              sx={{ marginX: "8px" }}
            >
              <NavLink
                to={"/employee/createInvoice"}
                style={({ isActive }) => ({
                  color: "inherit",
                  borderBottom: isActive ? "3px solid orange" : "",
                })}
              >
                <CreateIcon />
              </NavLink>
            </IconButton>
            <IconButton
              title="view invoices"
              color="inherit"
              sx={{ marginX: "8px" }}
            >
              <NavLink
                to={"/employee/viewInvoices"}
                style={({ isActive }) => ({
                  color: "inherit",
                  borderBottom: isActive ? "3px solid orange" : "",
                })}
              >
                <PageviewIcon />
              </NavLink>
            </IconButton>
            <IconButton
              title="view customers"
              color="inherit"
              sx={{ marginX: "8px" }}
            >
              <NavLink
                to={"/employee/viewCustomers"}
                state={employeeInfo}
                style={({ isActive }) => ({
                  color: "inherit",
                  borderBottom: isActive ? "3px solid orange" : "",
                })}
              >
                <PersonIcon />
              </NavLink>
            </IconButton>
          </Box>
          <Box flexGrow={2} textAlign={"right"}>
            <Button
              title="Log out"
              color="inherit"
              endIcon={<LogoutIcon />}
              onClick={handleClick}
            >
              <Typography mx={2}>
                {employeeInfo.employee_first_name +
                  " " +
                  employeeInfo.employee_last_name}
              </Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default EmployeeNav;
