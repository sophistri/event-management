export interface EventInput{
    title: string;
    description: string;
    location: string;
    category: string;
    startsAt: string;
    endsAt: string;
    capacity: number | null;
}

export interface OrganizerSummary{
    _id: string;
    username: string;
}

export interface EventItem extends EventInput{
    _id: string;
    attendeeCount: number;
    organizer: OrganizerSummary;
    createdAt: string;
    updatedAt: string;
}

export interface EventDetail extends EventItem{
    isRegistered: boolean;
}

export interface EventListResponse{
    events: EventItem[];
    total: number;
    page: number;
    pages: number;
}

export interface MyEventsResponse{
    events: EventItem[];
}

export interface RsvpResonse{
    attendeeCount: number;
    isRegistered: boolean;
}

export interface SavedEvent extends Omit<EventItem, 'organizer'> { 
    organizer: string;
}

export interface Attendee{
    _id: string;
    name: string;
    username: string;
    registeredAt: string;
}

export interface AttendeesResponse{
    attendees: Attendee[];
}