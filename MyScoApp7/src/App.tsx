import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
// import Layout from "./components/Layout";
import ProtectedRoute from "./routes/ProtectedRoute";
import MainLayout from "./layout/MainLayout";
import Users from "./pages/users";


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
    <ProtectedRoute>
      <MainLayout>
        <Dashboard />
      </MainLayout>
    </ProtectedRoute>
  }
/>

<Route
  path="/users"
  element={
    <ProtectedRoute>
      <MainLayout>
        <Users />
      </MainLayout>
    </ProtectedRoute>
  }
/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;