import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Signup from '../pages/Login/Signup';
import Home from '../pages/Home/Home';
// import { ProtectedRoute } from '../components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Example of a route that requires login — wrap it like this: */}
      {/* <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route> */}
    </Routes>
  );
}
