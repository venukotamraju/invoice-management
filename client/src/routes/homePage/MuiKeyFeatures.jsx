import React from "react";
import {
  Grid,
  Box,
  Card,
  CardContent,
  Typography,
  CardMedia,
  CardActions,
  Button
} from "@mui/material";
function MuiKeyFeatures() {
  const keyFeatures = [
    {
      name: "Create, manage and track invoices easily",
      description:
        "Allow yourself to create, manage and track invoices with ease and maximum feasibility",
      image:
        "https://plus.unsplash.com/premium_photo-1679923814036-8febf10a04c0?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Streamline your billing process",
      description:
        "Don't kill time by getting confused, follow the given structure and be productive and happy",
      image:
        "https://plus.unsplash.com/premium_photo-1679784204535-e623926075cb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Organize invoices by customers",
      description: "get easy access to generate invoices by filtering",
      image:
        "https://images.unsplash.com/photo-1649209979970-f01d950cc5ed?q=80&w=1941&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      name: "Generate customizable reports",
      description: "You will have your analytics, make what you do with it",
      image:
        "https://images.unsplash.com/photo-1494887205043-c5f291293cf6?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  return (
    <Box sx={{ margin: "10px" }}>
      <Grid container>
        {keyFeatures.map((feature) => (
          <Grid item key={feature.name} xs={12} lg={3} p={3}>
            <Card sx={{ width: "350px", margin: "4px" }} >
              <CardMedia
                component={"img"}
                height={"140"}
                image={feature.image}
                alt="unsplash-images"
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component={"div"}>
                  {feature.name}
                </Typography>
                <Typography gutterBottom variant="body1" color={"text.secondary"}>{feature.description}</Typography>
              </CardContent>
              <CardActions>
                <Button size="medium" variant="text" sx={{"&:hover":{textDecoration:"underline"}}}>Learn More</Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

export default MuiKeyFeatures;
