import { NavLink } from "react-router-dom";
import "./navbar.css";
import React from "react";

function NavBar() {
  return (
    <div>
      <nav>
        <ul>
          <li>
            <NavLink to={"/customersTable"} activeClassName="active">
              <span className="link-name">Customers</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={"/generateInvoice"} activeClassName="active">
              <span className="link-name">Invoices</span>
            </NavLink>
          </li>
          <li>
            <NavLink to={"/customerRegistration"} activeClassName="active">
              <span className="link-name">New Invoice</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default NavBar;
