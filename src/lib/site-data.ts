/**
 * Shared site content for All Black Limo SF (ported from includes/site-data.php).
 * Used by both server components and client components.
 */

export const site = {
  name: "All Black Limo SF",
  url: "https://allblacklimosf.com",
  phoneDisplay: "+1 (628) 241-5089",
  phoneHref: "+16282415089",
  email: "allblacklimosf@gmail.com",
  location: "San Francisco, California",
  instagram: "https://www.instagram.com/allblacklimo_sf/",
  reservationLeadHours: 12,
} as const;

export type ServiceDetail = {
  slug: string;
  nav: string;
  title: string;
  eyebrow: string;
  icon: string;
  short: string;
  intro: string;
  detailTitle: string;
  detailCopy: string[];
  image: string;
  highlights: string[];
  bestFor: string[];
  process: Array<[string, string]>;
  faq: Array<[string, string]>;
};

export const services: Record<string, ServiceDetail> = {
  "airport-transfers": {
    slug: "airport-transfers",
    nav: "Airport Transfers",
    title: "San Francisco Airport Transfers",
    eyebrow: "SFO · OAK · SJC",
    icon: "fa-plane-arrival",
    short: "Calm, coordinated airport pickups and drop-offs built around your itinerary.",
    intro:
      "Move between the Bay Area and its major airports with a private chauffeur, a carefully selected vehicle, and a pickup plan designed before you land.",
    detailTitle: "Airport transfers planned around the terminal, flight, and luggage.",
    detailCopy: [
      "Airport transportation begins before the vehicle arrives. We use the airport, airline, flight number, arrival or departure time, passenger count, and luggage profile to shape the pickup plan.",
      "For arrivals, request curbside pickup or meet-and-greet coordination. For departures, we work backward from the recommended terminal arrival time and consider traffic, pickup access, and the size of the traveling party.",
    ],
    image: "/images/fleet-cadillac-escalade-esv.webp",
    highlights: [
      "Flight-aware pickup coordination",
      "Curbside or meet-and-greet options",
      "Vehicle matching for passengers and luggage",
      "Direct service across the Bay Area",
    ],
    bestFor: ["Business travelers", "Families", "Private aviation", "Early and late departures"],
    process: [
      ["Share your itinerary", "Send the airport, airline, flight number, party size, and luggage needs."],
      ["We coordinate the pickup", "Your reservation is reviewed and the appropriate pickup plan is confirmed."],
      ["Meet your chauffeur", "Receive a professional, private transfer to your destination."],
    ],
    faq: [
      ["Which airports do you serve?", "We coordinate service for SFO, OAK, SJC, and other regional or private aviation locations by request."],
      ["Can you accommodate flight delays?", "Provide a valid flight number when booking so the pickup can be coordinated around the latest available arrival information."],
      ["Can I request an airport meet-and-greet?", "Yes. Tell us your terminal and preference when requesting the ride so availability and instructions can be confirmed."],
    ],
  },
  "corporate-transportation": {
    slug: "corporate-transportation",
    nav: "Corporate Travel",
    title: "Corporate & Executive Transportation",
    eyebrow: "Discreet · Precise · Professional",
    icon: "fa-briefcase",
    short: "Executive ground transportation that respects calendars, privacy, and presentation.",
    intro:
      "From a single executive transfer to a multi-stop business itinerary, every movement is planned to support punctual, focused travel across San Francisco and Silicon Valley.",
    detailTitle: "Executive transportation that follows the business agenda.",
    detailCopy: [
      "Corporate service is organized around meeting times, passenger contacts, building access, pickup instructions, and the amount of flexibility required between appointments.",
      "Arrange a single executive transfer, an hourly vehicle for a full day, guest transportation, or a coordinated series of movements for leadership teams and visiting clients.",
    ],
    image: "/images/fleet-audi-a6.webp",
    highlights: [
      "Point-to-point executive travel",
      "Multi-stop meeting itineraries",
      "Guest and client transportation",
      "Dedicated coordination for complex schedules",
    ],
    bestFor: ["Executives", "Corporate guests", "Investor meetings", "Leadership teams"],
    process: [
      ["Send the schedule", "Share passenger, pickup, meeting, and timing requirements."],
      ["Confirm the movement plan", "We align the vehicle and timing with the business itinerary."],
      ["Travel without friction", "Your chauffeur manages each confirmed transfer with professional discretion."],
    ],
    faq: [
      ["Can you manage several meetings in one day?", "Yes. Hourly or itinerary-based service can be requested for multi-stop schedules."],
      ["Can an assistant arrange the ride for an executive?", "Yes. The booking contact and passenger can be different; include both sets of details in the request."],
      ["Do you support recurring corporate transportation?", "Recurring requirements can be discussed directly so the preferred workflow can be documented."],
    ],
  },
  "hourly-chauffeur": {
    slug: "hourly-chauffeur",
    nav: "Hourly Chauffeur",
    title: "Hourly Chauffeur Service",
    eyebrow: "Your Schedule, Your Vehicle",
    icon: "fa-clock",
    short: "Keep a private vehicle and chauffeur available while your plans evolve.",
    intro:
      "Hourly service gives you the flexibility to make multiple stops, adjust timing, and keep your vehicle nearby without arranging a new ride for every movement.",
    detailTitle: "A dedicated chauffeur and vehicle for a flexible schedule.",
    detailCopy: [
      "Hourly service is designed for itineraries with several stops, waiting periods, appointments that may run long, or destinations that are not fully fixed at booking time.",
      "Share the starting point, expected service window, known stops, passenger count, and any timing priorities. Your vehicle remains assigned for the confirmed period and itinerary.",
    ],
    image: "/images/fleet-lincoln-navigator.webp",
    highlights: [
      "Flexible multi-stop itineraries",
      "A dedicated vehicle for the reserved period",
      "Ideal for changing schedules",
      "Private, comfortable waiting between stops",
    ],
    bestFor: ["Business days", "Shopping", "Dining itineraries", "Private engagements"],
    process: [
      ["Define the time window", "Tell us when and where the service should begin and the expected duration."],
      ["Outline known stops", "Share confirmed destinations while keeping room for reasonable adjustments."],
      ["Direct the day", "Use your reserved chauffeur for the agreed itinerary and service window."],
    ],
    faq: [
      ["Is there a minimum hourly reservation?", "Minimums can vary by vehicle, date, and itinerary. Request a quote for the exact requirement."],
      ["Can the itinerary change during service?", "Reasonable adjustments may be possible within the reserved time and service area; larger changes should be coordinated."],
      ["Does hourly service include wait time?", "The chauffeur and vehicle remain assigned during the reserved service window, subject to the confirmed terms."],
    ],
  },
  "point-to-point": {
    slug: "point-to-point",
    nav: "Point to Point",
    title: "Point-to-Point Black Car Service",
    eyebrow: "Direct, Private Transportation",
    icon: "fa-route",
    short: "A polished direct transfer between two locations with no ride-hailing uncertainty.",
    intro:
      "For dinners, meetings, residences, hotels, and venues, point-to-point service delivers a reserved vehicle and a clear pickup plan tailored to the journey.",
    detailTitle: "Direct private transportation from pickup to destination.",
    detailCopy: [
      "Point-to-point service is the right format when the pickup, destination, and time are known. The vehicle is reserved for that confirmed transfer rather than an open-ended service window.",
      "It works well for hotel and residence pickups, dinner reservations, meetings, venues, and city-to-city transportation. Planned stops should be included in the original request.",
    ],
    image: "/images/fleet-cadillac-lyriq.webp",
    highlights: [
      "Pre-arranged pickup and destination",
      "Private door-to-door experience",
      "Vehicle selected for the party",
      "Available across the Bay Area",
    ],
    bestFor: ["Hotel transfers", "Business meetings", "Dinner reservations", "Residential pickups"],
    process: [
      ["Choose pickup and destination", "Provide complete addresses, passenger count, and timing."],
      ["Review your quote", "Vehicle availability and the trip details are confirmed before service."],
      ["Enjoy the direct ride", "Your chauffeur completes the reserved transfer with attentive service."],
    ],
    faq: [
      ["Can I add a stop?", "Add planned stops to the original request. For multiple or flexible stops, hourly service may be the better fit."],
      ["How early should I reserve?", "Advance booking is recommended, especially for evenings, weekends, and large vehicles."],
      ["Can you pick up from a hotel or private residence?", "Yes. Provide the precise pickup address and any entrance or access instructions."],
    ],
  },
  "roadshows-events": {
    slug: "roadshows-events",
    nav: "Roadshows & Events",
    title: "Roadshows, Conferences & Event Transportation",
    eyebrow: "Coordinated Group Movement",
    icon: "fa-calendar-check",
    short: "Structured transportation for packed schedules, important guests, and live events.",
    intro:
      "Complex event days require more than a vehicle. We help organize the sequence of pickups, destinations, time windows, and passenger needs into a clear ground transportation plan.",
    detailTitle: "Event transportation built from a complete movement plan.",
    detailCopy: [
      "Roadshows and events may involve several passengers, vehicles, pickup points, venues, and critical time windows. We review the complete schedule before recommending the service structure.",
      "Provide a passenger manifest, venue access information, primary contacts, luggage requirements, and the order of movements so the confirmed vehicles can operate from one coordinated plan.",
    ],
    image: "/images/fleet-minibus-23-passengers.webp",
    highlights: [
      "Multi-vehicle coordination by request",
      "Detailed pickup and drop-off planning",
      "Guest, speaker, and executive movements",
      "Support for conferences and roadshows",
    ],
    bestFor: ["Roadshows", "Conferences", "Galas", "Concerts and sporting events"],
    process: [
      ["Share the event brief", "Provide dates, venues, passenger groups, and critical time windows."],
      ["Build the transportation plan", "We review vehicle requirements and the sequence of movements."],
      ["Coordinate the event day", "Each confirmed ride follows the established itinerary and contact plan."],
    ],
    faq: [
      ["Can you coordinate multiple vehicles?", "Yes, subject to availability. Send the complete requirement early so the right plan can be prepared."],
      ["Can different guests have different pickup locations?", "Yes. Include a passenger manifest and each pickup detail when requesting event transportation."],
      ["How far ahead should event transportation be booked?", "The earlier the better, particularly for conventions, major local events, and group vehicles."],
    ],
  },
  "wine-country-tours": {
    slug: "wine-country-tours",
    nav: "Napa & Sonoma",
    title: "Napa & Sonoma Wine Country Chauffeur",
    eyebrow: "A Refined Day Beyond the City",
    icon: "fa-wine-glass",
    short: "A private, comfortable way to enjoy Napa Valley and Sonoma at your own pace.",
    intro:
      "Turn a day in wine country into a composed private itinerary, with a chauffeur handling the road while your group focuses on tastings, dining, and the landscape.",
    detailTitle: "A private Wine Country itinerary with the driving handled.",
    detailCopy: [
      "A Napa or Sonoma day is typically arranged as hourly service so the vehicle can remain available between winery, dining, hotel, and residence stops.",
      "Share confirmed reservation times, addresses, party size, pickup location, and the desired return time. Realistic travel intervals help keep the day relaxed and the itinerary on schedule.",
    ],
    image: "/images/fleet-chevrolet-suburban.webp",
    highlights: [
      "Private round-trip transportation",
      "Multi-stop winery itineraries",
      "Comfortable space between appointments",
      "Vehicle options for couples and groups",
    ],
    bestFor: ["Couples", "Private groups", "Celebrations", "Client entertainment"],
    process: [
      ["Share the day plan", "Provide pickup location, winery reservations, dining plans, and party size."],
      ["Set the service window", "We help match the itinerary with an appropriate hourly reservation."],
      ["Enjoy wine country", "Your chauffeur manages the confirmed route and return journey."],
    ],
    faq: [
      ["Do you make winery reservations?", "Winery and restaurant reservations remain the guest's responsibility unless a custom arrangement is expressly confirmed."],
      ["Can we visit both Napa and Sonoma?", "It may be possible, but travel time should be considered. Share the complete itinerary for a realistic service plan."],
      ["Which vehicle is best for a group?", "Vehicle selection depends on passenger count, comfort preference, and any items carried during the day."],
    ],
  },
  "special-occasions": {
    slug: "special-occasions",
    nav: "Special Occasions",
    title: "Weddings & Special Occasions",
    eyebrow: "Arrive Beautifully",
    icon: "fa-champagne-glasses",
    short: "Elegant private transportation for the moments that deserve extra attention.",
    intro:
      "Create a smoother arrival and departure for weddings, anniversaries, birthdays, galas, and private celebrations with a vehicle selected for the occasion.",
    detailTitle: "Transportation coordinated around the occasion timeline.",
    detailCopy: [
      "Special-occasion service can cover the principal guests, couples, families, VIPs, or a larger event party. Timing, presentation, vehicle preference, and venue access are reviewed together.",
      "For weddings and multi-part events, include every pickup, ceremony, reception, photo, and departure window so we can recommend point-to-point, hourly, or group transportation.",
    ],
    image: "/images/fleet-mercedes-benz-s-class.webp",
    highlights: [
      "Wedding and celebration transfers",
      "Coordinated venue arrivals",
      "Couple, family, and VIP movements",
      "Hourly or point-to-point options",
    ],
    bestFor: ["Weddings", "Anniversaries", "Birthdays", "Galas and private dinners"],
    process: [
      ["Tell us about the occasion", "Share the venues, timing, passenger count, and the experience you want."],
      ["Choose the right format", "We match point-to-point or hourly service with an appropriate vehicle."],
      ["Celebrate with confidence", "Your confirmed transportation is organized around the event timeline."],
    ],
    faq: [
      ["Can the vehicle make multiple wedding-party trips?", "Depending on timing and distance, a tailored hourly plan may support multiple movements."],
      ["Can we request a specific vehicle?", "You can state a preference. Final availability and vehicle category are confirmed with the reservation."],
      ["Can decorations be added to the vehicle?", "Any decoration request must be discussed and approved in advance to protect the vehicle and maintain safety."],
    ],
  },
  "group-transportation": {
    slug: "group-transportation",
    nav: "Group Transportation",
    title: "Luxury Group Transportation",
    eyebrow: "One Group, One Coordinated Plan",
    icon: "fa-people-group",
    short: "Comfortable group movement for teams, guests, families, and event parties.",
    intro:
      "Keep your group together with an appropriately sized vehicle and a clear movement plan for airports, hotels, venues, meetings, or celebrations.",
    detailTitle: "Group transportation sized for people, luggage, and the route.",
    detailCopy: [
      "Group planning begins with accurate passenger and luggage counts. The right option may be an SUV, Executive Sprinter, 23-passenger minibus, 35-passenger bus, 55-passenger motorcoach, or a coordinated combination.",
      "Provide pickup locations, destinations, loading restrictions, time windows, and a lead contact. For large programs, advance planning improves vehicle availability and movement timing.",
    ],
    image: "/images/fleet-executive-sprinter.webp",
    highlights: [
      "SUV, van, and group vehicle options",
      "Passenger and luggage planning",
      "Hotel-to-venue transportation",
      "Single or multi-vehicle requests",
    ],
    bestFor: ["Corporate teams", "Families", "Wedding guests", "Conference groups"],
    process: [
      ["Count passengers and luggage", "Accurate numbers help determine the correct vehicle category."],
      ["Map every movement", "Provide pickup points, destinations, and time windows for the group."],
      ["Travel together", "Your confirmed vehicle follows the group transportation plan."],
    ],
    faq: [
      ["What group sizes can you accommodate?", "Options depend on current fleet availability. Send the exact passenger and luggage count for the right recommendation."],
      ["Can you move a group between a hotel and event venue?", "Yes. This is a common use for group transportation and may include one or several scheduled movements."],
      ["Do large groups need more lead time?", "Yes. Advance planning is strongly recommended for vans, minibuses, and multi-vehicle requirements."],
    ],
  },
};

export const serviceList = Object.values(services);

export type FleetVehicle = {
  name: string;
  class: string;
  image: string;
  passengers: string;
  luggage: string;
  feature: string;
};

export const fleet: FleetVehicle[] = [
  {
    name: "Cadillac Escalade ESV",
    class: "Premium SUV",
    image: "/images/fleet-cadillac-escalade-esv.webp",
    passengers: "Up to 6",
    luggage: "By configuration",
    feature: "Extended luxury SUV for airport, executive, and VIP transportation.",
  },
  {
    name: "Audi A6",
    class: "Executive Sedan",
    image: "/images/fleet-audi-a6.webp",
    passengers: "Up to 2",
    luggage: "By configuration",
    feature: "Discreet executive sedan for business travel and private transfers.",
  },
  {
    name: "Cadillac LYRIQ",
    class: "Electric Luxury SUV",
    image: "/images/fleet-cadillac-lyriq.webp",
    passengers: "Up to 2",
    luggage: "By configuration",
    feature: "Quiet electric luxury for modern private journeys.",
  },
  {
    name: "GMC Yukon",
    class: "Premium SUV",
    image: "/images/fleet-gmc-yukon.webp",
    passengers: "Up to 7",
    luggage: "By configuration",
    feature: "Spacious premium transportation for passengers, luggage, and longer journeys.",
  },
  {
    name: "Chevrolet Suburban",
    class: "Premium SUV",
    image: "/images/fleet-chevrolet-suburban.webp",
    passengers: "Up to 7",
    luggage: "By configuration",
    feature: "A versatile choice for groups, business travel, and airport service.",
  },
  {
    name: "Lincoln Navigator",
    class: "Premium SUV",
    image: "/images/fleet-lincoln-navigator.webp",
    passengers: "Up to 6",
    luggage: "By configuration",
    feature: "Refined SUV comfort for executive travel and private occasions.",
  },
  {
    name: "Mercedes-Benz S-Class",
    class: "First Class Sedan",
    image: "/images/fleet-mercedes-benz-s-class.webp",
    passengers: "Up to 2",
    luggage: "By configuration",
    feature: "First-class comfort for executive and private transportation.",
  },
  {
    name: "Executive Sprinter",
    class: "Executive Van",
    image: "/images/fleet-executive-sprinter.webp",
    passengers: "Up to 13",
    luggage: "By configuration",
    feature: "Premium group transportation for events, teams, and roadshows.",
  },
  {
    name: "Minibus — 23 Passengers",
    class: "Group Transportation",
    image: "/images/fleet-minibus-23-passengers.webp",
    passengers: "Up to 23",
    luggage: "By configuration",
    feature: "Coordinated transportation for groups, events, and tournament programs.",
  },
  {
    name: "Bus — 55 Passengers",
    class: "Motorcoach",
    image: "/images/fleet-bus-55-passengers.webp",
    passengers: "Up to 55",
    luggage: "By configuration",
    feature: "Large-group transportation for conferences, events, and scheduled programs.",
  },
  {
    name: "Bus — 35 Passengers",
    class: "Motorcoach",
    image: "/images/fleet-bus-35-passengers.webp",
    passengers: "Up to 35",
    luggage: "By configuration",
    feature: "Comfortable transportation for medium-size groups and event movements.",
  },
];

export const homeFaq: Array<[string, string]> = [
  [
    "How do I request a ride?",
    "Use the online request form or call +1 (628) 241-5089. Share your date, time, locations, passenger count, and luggage or vehicle needs.",
  ],
  [
    "Is the online form an instant confirmed booking?",
    "The form begins the reservation process. Availability, trip details, vehicle category, and quote are reviewed before the ride is confirmed.",
  ],
  [
    "Which Bay Area airports do you serve?",
    "Airport transfer requests can be made for SFO, OAK, SJC, and other regional or private aviation locations.",
  ],
  [
    "Should I choose hourly or point-to-point service?",
    "Point-to-point is ideal for a direct planned transfer. Hourly service is better when you need several stops, waiting time, or flexibility during the reserved window.",
  ],
  [
    "Can you accommodate groups?",
    "Yes, subject to vehicle availability. Send the exact number of passengers and luggage so the correct category can be recommended.",
  ],
];

export const navItems: Array<{ label: string; href: string; section: string }> = [
  { label: "Home", href: "/", section: "home" },
  { label: "About", href: "/about", section: "about" },
  { label: "Services", href: "/services", section: "services" },
  { label: "Fleet", href: "/fleet", section: "fleet" },
  { label: "Blog", href: "/blog", section: "blog" },
  { label: "Contact", href: "/contact", section: "contact" },
];

export const serviceAreas = [
  "San Francisco",
  "SFO",
  "Oakland",
  "San Jose",
  "Palo Alto",
  "Napa",
  "Sonoma",
  "Marin",
];
