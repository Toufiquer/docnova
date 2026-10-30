/*
|-----------------------------------------
| setting up data.ts for the App
| @author: Toufiquer Rahman<toufiquer.0@gmail.com>
| @copyright: Toufiquer, 1 November, 2026
|-----------------------------------------
*/
export type HomeCard = { title: string; description: string };
export type HomeData = {
  forceUpdate: "true" | "false";
  paddingX: number;
  paddingY: number;
  eyebrow: string;
  title: string;
  intro: string;
  imageUrl: string;
  imageAlt: string;
  sectionsJson: string;
};

// The eleven editable content slots follow the hero in a fixed order.
export const defaultCards: HomeCard[] = [
  {
    title: "Care for every chapter of life",
    description: "From your first question to your next step, explore a more thoughtful approach to healthcare.",
  },
  {
    title: "Find the right direction for your care",
    description: "Explore areas of medicine and ask our team about the care that fits your needs.",
  },
  {
    title: "A more human kind of healthcare",
    description:
      "Good care starts with listening. We believe every patient deserves clarity, attention, and a comfortable experience.",
  },
  {
    title: "A conversation with the right specialist",
    description:
      "Finding the right doctor starts with understanding what matters to you. Contact us to ask about specialist consultations.",
  },
  {
    title: "Let’s find your next step",
    description: "Tell our team what kind of care you are looking for and ask about appointment options.",
  },
  {
    title: "A clearer picture of your health",
    description:
      "Diagnostic and laboratory services help inform conversations about your health. Contact us to ask about specific tests.",
  },
  {
    title: "Spaces designed around care",
    description: "A welcoming environment can make a meaningful difference to your healthcare experience.",
  },
  {
    title: "When you need support",
    description:
      "For a medical emergency, contact your local emergency services or go to the nearest emergency department.",
  },
  {
    title: "Your experience matters",
    description: "Patient stories will be shared here when verified experiences are available.",
  },
  {
    title: "A little more clarity",
    description: "Helpful starting points for planning your visit and understanding your options.",
  },
  {
    title: "Care begins with a conversation",
    description: "Have a question about appointments, services, or your next visit? Get in touch with Docnova.",
  },
];
export const defaultHomeCard: HomeCard = { title: "New section", description: "Add a short description." };
export const defaultData: HomeData = {
  forceUpdate: "false",
  paddingX: 0,
  paddingY: 0,
  eyebrow: "Care that starts with you",
  title: "A healthier tomorrow begins here.",
  intro:
    "Thoughtful care, specialist consultations, and diagnostics — designed around the person who matters most: you.",
  imageUrl: "",
  imageAlt: "A healthcare professional speaking with a patient",
  sectionsJson: JSON.stringify(defaultCards),
};
export function parseHomeCards(value: unknown): HomeCard[] {
  if (typeof value !== "string") return defaultCards;
  try {
    const parsed: unknown = JSON.parse(value);
    if (!Array.isArray(parsed)) return defaultCards;
    return parsed
      .filter((item): item is Record<string, unknown> => !!item && typeof item === "object" && !Array.isArray(item))
      .map((item) => ({
        title: typeof item.title === "string" ? item.title : "",
        description: typeof item.description === "string" ? item.description : "",
      }));
  } catch {
    return defaultCards;
  }
}

// Representative Unsplash photographs, not photographs of Docnova staff or facilities.
export const photos = {
  hero: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1600&q=85",
  consultation: "https://images.unsplash.com/photo-1666214280557-f1b5022eb634?w=1000&q=80",
  doctor: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=1000&q=80",
  hospital: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3?w=1000&q=80",
  care: "https://images.unsplash.com/photo-1581595219315-a187dd40c322?w=1000&q=80",
  interior: "https://images.unsplash.com/photo-1538108149393-fbbd81895907?w=1000&q=80",
  laboratory: "https://images.unsplash.com/photo-1579154204601-01588f351e67?w=1000&q=80",
  specialist: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1000&q=80",
};
export const services = [
  ["Specialist consultations", "Discuss your concerns and explore the next steps in your care.", "Users"],
  ["Patient care", "A patient-first approach to questions, visits, and ongoing care.", "Heart"],
  ["Diagnostic services", "Learn more about diagnostic options for your health needs.", "Activity"],
  ["Laboratory services", "Ask about tests and the information you need before a visit.", "FileText"],
  ["General medicine", "A place to begin when you have questions about your health.", "Plus"],
  ["Appointment support", "Get in touch for help exploring appointment options.", "Calendar"],
];
export const departments = ["Cardiology", "Neurology", "Orthopedics", "Pediatrics", "Dermatology", "General Medicine"];
export const faqs = [
  [
    "How can I ask about an appointment?",
    "Contact Docnova to ask about appointment options and the information needed for your visit.",
  ],
  [
    "How do I find the right specialist?",
    "Tell our team what kind of care you are seeking and ask about available specialists.",
  ],
  [
    "Are diagnostic tests available?",
    "Contact us for current information about specific diagnostic and laboratory services.",
  ],
  [
    "What should I bring to my visit?",
    "Ask the team when arranging your visit. Relevant previous reports and a list of your current medicines may be helpful.",
  ],
];
