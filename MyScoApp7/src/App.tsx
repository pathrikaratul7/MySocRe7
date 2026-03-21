import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import Layout from "./components/Layout";
// import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import User from "./pages/users";


function App() {
  
  return (
    


    <BrowserRouter>
      <Routes>

        {/* Startup Page */}
        <Route path="/" element={<Login />} />

        {/* Protected Layout */}
        {/* <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
        </Route> */}


<Route
  path="/dashboard"
  element={
    <MainLayout>
      <Dashboard />
    </MainLayout>
  }
/>

<Route
  path="/users"
  element={
    <MainLayout>
      <User />
    </MainLayout>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;