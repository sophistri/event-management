import EventCollection from "../../components/EventCollection";
import { myEvents } from "../../api/events";

export default function MyEventsPage() {
  return (
    <EventCollection
      title="My events"
      load={myEvents}
      emptyText="You have not created any events yet."
      emptyAction={{ to: "/events/new", label: "Create an event" }}
    />
  );
}