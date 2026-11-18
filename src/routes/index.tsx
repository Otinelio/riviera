import { createFileRoute } from "@tanstack/react-router";
import Navbar from "@/components/site/Navbar";
import PageTransition from "@/components/site/PageTransition";
import Hero from "@/components/site/Hero";
import BookingBar from "@/components/site/BookingBar";
import RoomsSection from "@/components/site/RoomsSection";
import BookingForm from "@/components/site/BookingForm";
import AmenitiesGrid from "@/components/site/AmenitiesGrid";
import Restaurants from "@/components/site/Restaurants";
import Highlights from "@/components/site/Highlights";
import Tour360 from "@/components/Tour360";
import Gallery from "@/components/site/Gallery";
import Events from "@/components/site/Events";
import Testimonials from "@/components/site/Testimonials";
import Location from "@/components/site/Location";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import WaveDivider from "@/components/site/WaveDivider";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Hotel Riviera Ramatou Plage — Lomé, Togo | Plage Privée & Piscine" },
      { name: "description", content: "Hôtel-resort de bord de mer à Lomé, Togo. Plage privée Atlantique, piscine, 2 restaurants, suites vue mer. Réservation directe via WhatsApp." },
      { property: "og:title", content: "Hotel Riviera Ramatou Plage — Lomé, Togo" },
      { property: "og:description", content: "L'Atlantique à vos pieds. Plage privée, piscine, gastronomie tropicale à Lomé." },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Index,
});

function Index() {
  return (
    <main className="bg-ivory text-foreground">
      <Navbar />
      <PageTransition>
        <Hero />
        <BookingBar />
        <RoomsSection />
        <WaveDivider color="oklch(0.94 0.01 85)" />
        <AmenitiesGrid />
        <Restaurants />
        <Highlights />
        <Tour360 />
        <Gallery />
        <Events />
        <BookingForm />
        <Testimonials />
        <Location />
      </PageTransition>
      <Footer />
      <WhatsAppFloat />
    </main>
  );
}
