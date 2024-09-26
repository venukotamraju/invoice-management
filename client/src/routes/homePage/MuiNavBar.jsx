import React from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Stack,
  Divider,
  Link,
} from "@mui/material";
import ReceiptIcon from "@mui/icons-material/Receipt";
function MuiNavBar() {
  return (
    <Box sx={{ margin: "10px" }}>
      <AppBar position="static">
        <Toolbar>
          <Link href="/home" color={"inherit"} mx={1} p={0}>
            <ReceiptIcon />
          </Link>
          <Typography variant="h5" component={"h1"} sx={{ flexGrow: 1 }}>
            Enterprise Invoice Management
          </Typography>
          <Stack
            direction={"row"}
            spacing={2}
            divider={<Divider orientation="vertical" flexItem />}
            overflow={"hidden"}
          >
            <Button color="inherit" variant="text">
              <Link
                href="/home/login"
                underline="hover"
                color={"inherit"}
                sx={{ "&:hover": { color: "white" } }}
              >
                Login
              </Link>
            </Button>
            <Button color="inherit" variant="text">
              About
            </Button>
            <Button color="inherit" variant="text">
              Contact
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>
    </Box>
  );
}

export default MuiNavBar;
