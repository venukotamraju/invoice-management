import React, { createContext, useEffect, useState } from "react";
import CompanyNav from "./CompanyNav";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import MuiFooter from "../homePage/MuiFooter";
import { Box, Typography } from "@mui/material";
const CompanyInfoContext = createContext();
function CompanyHome() {
  const location = useLocation();
  const nav = useNavigate();
  const [info, setInfo] = useState(location.state ? location.state.info : "");
  const [loading, setLoading] = useState(true);
  console.log(location);
  useEffect(() => {
    fetch("http://localhost:4001/loginCompany", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        data.auth.companyAuth
          ? setInfo(data.auth.companyAuth.info)
          : nav("/home/login");
      })
      .catch((err) => console.error("error from fetching cookie: ", err));
  }, []);
  setTimeout(() => setLoading(false), 500);
  if (loading) {
    return (
      <Box>
        <Typography>Loading</Typography>
      </Box>
    );
  }
  if (!loading) {
    if (info) {
      return (
        <Box>
          <CompanyInfoContext.Provider value={info}>
            <CompanyNav
              companyName={info.company_name}
              companyGstNo={info.company_gst_no}
            />
            <Outlet />
            <MuiFooter />
          </CompanyInfoContext.Provider>
        </Box>
      );
    }
  }
}
export { CompanyInfoContext };
export default CompanyHome;
