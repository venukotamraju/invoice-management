import React, { createContext, useEffect, useState } from "react";
import { Box } from "@mui/material";
import EmployeeNav from "./EmployeeNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
const EmployeeInfoContext = createContext();
function EmployeeHome() {
  const nav = useNavigate();
  const [employeeInfo, setEmployeeInfo] = useState(
    useLocation().state?.info || null
  );
  useEffect(() => {
    fetch("http://localhost:4001/login/employee", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) =>
        data.auth.employeeAuth === false
          ? nav("/home/login")
          : setEmployeeInfo(data.auth.employeeAuth.info)
      );
  }, []);
  return employeeInfo ? (
    <Box>
      <EmployeeInfoContext.Provider value={employeeInfo}>
        <EmployeeNav />
        <Outlet />
      </EmployeeInfoContext.Provider>
    </Box>
  ) : (
    nav("home/login")
  );
}
export { EmployeeInfoContext };
export default EmployeeHome;
