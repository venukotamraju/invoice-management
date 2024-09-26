import React from "react";
import { Outlet } from "react-router-dom";
import NavBar from "../components/pageLayout/navbar/NavBar";



function LandingPage() {
  const Template = () => {
    const templateStyles = {
      width:"fit",
      height:"fit",
      display:"flex"
    };
    return (
      <div className="template_container" style={templateStyles}>
          <div className="aside" 
          style={{marginBlock:"10px", marginLeft:"10px", flexBasis:"25%", padding:"20px",}}>
            <div style={{display:"flex",flexDirection:"column",alignContent:"center", justifyContent:"center", height:"60vh"}}>
              <h1 style={{fontWeight:"600",letterSpacing:"2px",textTransform:"uppercase"}}>Invoice Management</h1>
              <NavBar />
            </div>  
          </div>
        
          <div
            className="content"
            style={{flexBasis:"75%", height:"fit",border:"2px solid black"}}
          >
          <Outlet />
          </div>
      </div>
    );
  };
  return (
    <div>
      <Template />
    </div>
  );
}

export default LandingPage;
