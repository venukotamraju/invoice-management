import React, { useEffect, useState } from "react";
import ReusableLoginComponent from "./ReusableLoginComponent";
import { Box, Button, Grid, Typography } from "@mui/material";
import ErrorIcon from "@mui/icons-material/Error";
import { useNavigate } from "react-router-dom";
function Login() {
  const [submissionResponse, setSubmissionResponse] = useState({
    employee: null,
    company: null,
  });
  const [loginCard, setLoginCard] = useState({
    company: true,
    employee: false,
  });
  const nav = useNavigate();
  useEffect(() => {
    fetch("http://localhost:4001/loginCompany", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) =>
        data.auth.companyAuth.status === true
          ? nav("/company", {
              state: {
                info: data.auth.companyAuth.info,
              },
            })
          : console.log(data)
      )
      .catch((err) =>
        console.error("error from fetching /loginCompany for cookies", err)
      );
    fetch("http://localhost:4001/login/employee", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) =>
        data.auth.employeeAuth.status === true
          ? nav("/employee", {
              state: {
                info: data.auth.employeeAuth.info,
              },
            })
          : console.log(data)
      )
      .catch((err) =>
        console.error("error from fetching employee cookie", err)
      );
  }, []);

  const handleSubmitEmployee = (values, { resetForm }) => {
    fetch("http://localhost:4001/login/employee", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        !data.status
          ? setSubmissionResponse({
              ...submissionResponse,
              employee: data["message"],
            })
          : nav("/employee", { state: { info: data.employeeAuth.info } });
      })
      .catch((err) => console.error("error from posting login details: ", err));
    resetForm();
  };
  const handleSubmitCompany = (values, { resetForm }) => {
    fetch("http://localhost:4001/loginCompany", {
      method: "post",
      body: JSON.stringify(values),
      headers: {
        "Content-type": "application/json",
      },
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) =>
        !data.status
          ? setSubmissionResponse({
              ...submissionResponse,
              company: data["message"],
            })
          : nav("/company", { state: { info: data.companyAuth.info } })
      )
      .catch((err) => console.error("from posting to /loginCompany: ", err));
    setTimeout(
      () => setSubmissionResponse({ ...submissionResponse, company: null }),
      5000
    );
    resetForm();
  };
  return loginCard.company ? (
    <Box display={"flex"} height={"80vh"} alignItems={"center"} justifyContent={"center"} flexDirection={"column"}>
      <ReusableLoginComponent
        formName={"Company Login"}
        user={"company"}
        onSubmit={handleSubmitCompany}
      />
      {submissionResponse.company ? (
        <Typography
          width={"100%"}
          textAlign={"center"}
          variant="body1"
          component={"div"}
          display={"flex"}
          fontWeight={600}
          color={"error"}
          my={1}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <ErrorIcon fontSize="large" sx={{ marginRight: "10px" }} />
          {submissionResponse.company}
        </Typography>
      ) : null}
      {
        <Box width={"100%"} textAlign={"center"} p={3}>
          <Button
            variant="outlined"
            onClick={() =>
              setLoginCard({ ...loginCard, company: false, employee: true })
            }
          >
            Login as employee
          </Button>
        </Box>
      }
    </Box>
  ) : (
    <Box display={"flex"} flexDirection={"column"} height={"80vh"} alignItems={"center"} justifyContent={"center"}>
      <ReusableLoginComponent
        formName={"Employee Login"}
        user={"employee"}
        onSubmit={handleSubmitEmployee}
      />
      {submissionResponse.employee ? (
        <Typography
          width={"100%"}
          textAlign={"center"}
          variant="body1"
          component={"div"}
          display={"flex"}
          fontWeight={600}
          color={"error"}
          my={1}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <ErrorIcon fontSize="large" sx={{ marginRight: "10px" }} />
          {submissionResponse.employee}
        </Typography>
      ) : null}
      {
        <Box width={"100%"} textAlign={"center"} p={3}>
          <Button
            variant="outlined"
            onClick={() =>
              setLoginCard({ ...loginCard, company: true, employee: false })
            }
          >
            Login as company
          </Button>
        </Box>
      }
    </Box>
  );
}

export default Login;
