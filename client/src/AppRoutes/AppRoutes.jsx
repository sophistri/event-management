import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Signup from '../pages/Login/Signup';
import Home from '../pages/Home/Home';
import { ProtectedRoute } from '../components/ProtectedRoute';

import EventsPage from '../pages/Events/EventsPage';
import EventFormPage from '../pages/Events/EventFormPage';
import EventDetailPage from '../pages/Events/EventDetailPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route path="/events" element={<EventsPage />} />
      <Route path="/events/:id" element={<EventDetailPage />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/events/new" element={<EventFormPage />} />
        <Route path="/events/:id/edit" element={<EventFormPage />} />
      </Route>

      {/* Example of a route that requires login — wrap it like this: */}
      {/* <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route> */}
    </Routes>
  );
}
