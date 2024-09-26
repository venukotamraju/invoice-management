import React from "react";
import { Box, Container, Typography } from "@mui/material";

function MuiFooter() {
  return (
    <Box
      component="footer"
      sx={{
        borderTop: "2px solid black",
        marginTop: "auto",
        p: 3,
        bottom:2,
        position:"static",
        width:"100%"
      }}
    >
      <Container style={{ textAlign: "center" }} maxWidth="xl" >
        <Typography variant="body2" color="inherit">
          Copyright ©2024. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}

export default MuiFooter;
