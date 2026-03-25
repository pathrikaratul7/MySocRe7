import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import Layout from "../components/Layout";
import Users from "../pages/users";
import UserEdit from "../pages/userEdit";
import Guestlist from "../pages/guestlist";
import GuestEdit from "../pages/guestedit";
import Flatlist from "../pages/flatlist";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>

        {/* Login Page */}
        <Route path="/" element={<Login />} />

        {/* Master Layout */}
        <Route element={<Layout />}>

          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/guestlist" element={<Guestlist/>}/>
          <Route path="/user-edit/:id" element={<UserEdit />} />
          <Route path="/guest-edit/:id" element={<GuestEdit/>}/>
          <Route path="/Flatlist" element={<Flatlist/>}/>

        </Route>

      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;