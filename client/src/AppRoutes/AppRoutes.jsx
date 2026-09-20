import { Routes, Route } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Signup from '../pages/Login/Signup';
import Home from '../pages/Home/Home';
import { ProtectedRoute } from '../components/ProtectedRoute';
import EventsLayout from '../components/EventsLayout';

import EventsPage from '../pages/Events/EventsPage';
import EventFormPage from '../pages/Events/EventFormPage';
import EventDetailPage from '../pages/Events/EventDetailPage';
import MyEventsPage from '../pages/Dashboard/MyEventsPage';
import MyRegistrationsPage from '../pages/Dashboard/MyRegistrationsPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Home and everything under /events share the nav bar from EventsLayout */}
      <Route element={<EventsLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />

        {/* Login required for these (ProtectedRoute renders an <Outlet />) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/events/new" element={<EventFormPage />} />
          <Route path="/events/:id/edit" element={<EventFormPage />} />
          <Route path="/my/events" element={<MyEventsPage />} />
          <Route path="/my/registrations" element={<MyRegistrationsPage />} />
        </Route>
      </Route>
    </Routes>
  );
}