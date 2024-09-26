import {
  Drawer,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Link,
  IconButton,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleIcon from "@mui/icons-material/People";
import CreateIcon from "@mui/icons-material/Create";
import HomeIcon from "@mui/icons-material/Home";
import { useState } from "react";
import InventoryIcon from "@mui/icons-material/Inventory";
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
function CompanyNav({ companyName, companyGstNo }) {
  const nav = useNavigate();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const handleClickLogOut = () => {
    fetch("http://localhost:4001/logoutCompany", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => (data.message.logOut ? nav("/home/login") : null))
      .catch((err) => console.error("error from logging out: ", err));
  };
  return (
    <Box sx={{ margin: "10px" }}>
      <AppBar position="static">
        <Toolbar>
          <Box flexGrow={1} justifyContent={"left"}>
            <IconButton
              id="resourcesButton"
              edge="start"
              onClick={() => setIsDrawerOpen(true)}
              size="small"
              color="inherit"
              sx={{ borderRadius: 0 }}
            >
              <MenuIcon fontSize="small" sx={{ border: "none" }} />
            </IconButton>
          </Box>
          <Drawer
            anchor="left"
            open={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
          >
            <Box p={2} height={"100%"}>
              <Box>
                <Button startIcon={<CreateIcon />}>
                  <Link href="/company/register" underline="none">
                    Register Employee
                  </Link>
                </Button>
              </Box>
              <Box>
                <Button startIcon={<PeopleIcon />}>
                  <Link href="/company/employees" underline="none">
                    View employees
                  </Link>
                </Button>
              </Box>
              <Box>
                <Button startIcon={<InventoryIcon />}>
                  <Link href="/company/addProducts" underline="none">
                    Add Products
                  </Link>
                </Button>
              </Box>
              <Box>
                <Button startIcon={<InventoryOutlinedIcon />}>
                  <Link href="/company/viewProducts" underline="none">
                    View Products
                  </Link>
                </Button>
              </Box>
              <Box>
                <Button startIcon={<HomeIcon />}>
                  <Link href="/company" underline="none">
                    Home
                  </Link>
                </Button>
              </Box>
            </Box>
          </Drawer>
          <Box
            flexGrow={2}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Link href="/home" color={"inherit"} mx={1} p={0}>
              <ReceiptIcon fontSize="small" />
            </Link>
            <Typography variant="body1" component={"h2"} fontWeight={"200"}>
              {companyName} | {companyGstNo}
            </Typography>
          </Box>
          <Box flexGrow={1} justifyContent={"right"} display={"flex"}>
            <Button color="inherit" variant="text" onClick={handleClickLogOut}>
              <Typography variant="body2" fontSize={"small"}>
                Logout
              </Typography>
            </Button>
          </Box>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
CompanyNav.propTypes = {
  companyName: PropTypes.string.isRequired,
  companyGstNo: PropTypes.string.isRequired,
};

export default CompanyNav;
