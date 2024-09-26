import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LandingPage from "./routes/LandingPage";
import CustomerRegistration from "./components/invoiceContainer/customerRegistration/CustomerRegistration";
import LineItems from "./components/invoiceContainer/lineitems/LineItems";
import InvoicePreview from "./components/invoiceContainer/generateInvoice/invoicePreview/InvoicePreview";
import InvoiceListing from "./components/invoiceContainer/generateInvoice/invoiceListing/InvoiceListing";
import InvoiceFinal from "./components/invoiceContainer/generateInvoice/invoiceFinal/InvoiceFinal";
import NotFound from "./components/notFound/NotFound";
import HomePage from "./routes/homePage/HomePage";
import Login from "./components/authentication/login/Login";
import MuiSection from "./routes/homePage/MuiSection";
import CompanyRegistration from "./components/authentication/company/CompanyRegistration";
import CompanyHome from "./routes/companyPage/CompanyHome";
import CompanyRegisterEmployee from "./routes/companyPage/CompanyRegisterEmployee";
import CompanySection from "./routes/companyPage/CompanySection";
import CompanyEmployees from "./routes/companyPage/CompanyEmployees";
import EmployeeSection from "./routes/employeePage/EmployeeSection";
import EmployeeHome from "./routes/employeePage/EmployeeHome";
import InvoiceCustomerRegistration from "./routes/invoice/InvoiceCustomerRegistration";
import InvoiceLineItems from "./routes/invoice/InvoiceLineItems";
import InvoicePrint from "./routes/invoice/InvoicePrint";
import ViewCustomersMui from "./views/ViewCustomersMui";
import ViewInvoicesMui from "./views/ViewInvoicesMui";
import CompanyAddProducts from "./routes/companyPage/CompanyAddProducts";
import CompanyViewProducts from "./routes/companyPage/CompanyViewProducts";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route exact path="/404" element={<NotFound />}></Route>
          <Route exact path="/home" element={<HomePage />}>
            <Route exact path="/home" element={<MuiSection />} />
            <Route exact path="/home/login" element={<Login />} />
            <Route
              exact
              path="/home/signUp"
              element={<CompanyRegistration />}
            />
          </Route>
          <Route exact path="/company" element={<CompanyHome />}>
            <Route exact path="/company" element={<CompanySection />} />
            <Route
              exact
              path="/company/register"
              element={<CompanyRegisterEmployee />}
            />
            <Route
              exact
              path="/company/employees"
              element={<CompanyEmployees />}
            />
            <Route
              exact
              path="/company/addProducts"
              element={<CompanyAddProducts />}
            />
            <Route
              exact
              path="/company/viewProducts"
              element={<CompanyViewProducts />}
            />
          </Route>
          <Route exact path="/employee" element={<EmployeeHome />}>
            <Route exact path="/employee" element={<EmployeeSection />} />
            <Route
              exact
              path="/employee/createInvoice"
              element={<InvoiceCustomerRegistration />}
            />
            <Route
              exact
              path="/employee/lineItems"
              element={<InvoiceLineItems />}
            />
            <Route
              exact
              path="/employee/invoicePrint"
              element={<InvoicePrint />}
            />
            <Route
              exact
              path="/employee/viewCustomers"
              element={<ViewCustomersMui />}
            />
            <Route
              exact
              path="/employee/viewInvoices"
              element={<ViewInvoicesMui />}
            />
          </Route>

          <Route path="*" element={<Navigate to={"/home"} />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
