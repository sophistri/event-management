import EventCollection from "../../components/EventCollection";
import { myRegistrations } from "../../api/events";

export default function MyRegistrationsPage() {
  return (
    <EventCollection
      title="My registrations"
      load={myRegistrations}
      emptyText="You have not registered for any events yet."
      emptyAction={{ to: "/events", label: "Browse events" }}
    />
  );
}