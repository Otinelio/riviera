import { Plane, Car, MapPin, Clock } from "lucide-react";
import { SectionHeading } from "./RoomsSection";
import { waLink, HOTEL } from "@/lib/hotel";

export default function Location() {
  return (
    <section id="contact" className="py-24 bg-muted">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Accès" title="Nous trouver" desc="À 8km de l'aéroport, sur la plage de Baguida." />
        <div className="mt-16 grid lg:grid-cols-2 gap-8">
          <div className="rounded-3xl overflow-hidden shadow-elegant h-[480px]">
            <iframe
              title="Carte"
              src="https://www.google.com/maps?q=Baguida+Beach+Lome+Togo&output=embed"
              className="w-full h-full border-0"
              loading="lazy"
            />
          </div>
          <div className="space-y-4">
            {[
              { icon: Plane, title: "Aéroport Lomé-Tokoin", desc: "8 km — Navette aéroport disponible (20€)", action: "Demander le transfert" },
              { icon: Car, title: "Parking gratuit", desc: "Sécurisé 24h/24 sur place", action: null },
              { icon: MapPin, title: "Plage de Baguida", desc: HOTEL.address, action: null },
              { icon: Clock, title: "Horaires", desc: "Check-in : 13h–16h • Check-out : 12h • Réception 24/7", action: null },
            ].map(({ icon: Icon, title, desc, action }) => (
              <div key={title} className="p-6 rounded-2xl bg-card border border-border flex items-start gap-4 shadow-soft">
                <div className="w-12 h-12 rounded-xl bg-ocean/10 text-ocean flex items-center justify-center shrink-0">
                  <Icon size={22} />
                </div>
                <div className="flex-1">
                  <div className="font-display text-xl text-navy">{title}</div>
                  <div className="text-sm text-muted-foreground mt-1">{desc}</div>
                  {action && (
                    <a href={waLink(`✈️ *NAVETTE AÉROPORT*\n\nBonjour, je souhaite réserver le transfert depuis l'aéroport de Lomé (20€).`)}
                      target="_blank" rel="noreferrer"
                      className="mt-3 inline-block text-sm text-coral font-medium hover:underline">
                      {action} →
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
