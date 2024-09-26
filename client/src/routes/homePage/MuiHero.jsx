import React from "react";
import {
  ImageListItem,
  Box,
} from "@mui/material";

function MuiHero() {
  return (
    <Box sx={{ margin: "10px" }}>
      <ImageListItem>
        <img
          src="https://alto.co/wp-content/uploads/2019/05/alto-hero-invoice-templates-1280x768.png"
          alt="hero"
          loading="lazy"
        />
      </ImageListItem>
    </Box>
  );
}

export default MuiHero;
