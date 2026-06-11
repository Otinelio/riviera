import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SiteLayout from "@/components/site/SiteLayout";
import { useRiviera, waLinkFromStore } from "@/store/riviera";
import { Plane, MapPin, Building, Waves, Phone, Mail, Instagram, Clock, Send } from "lucide-react";
import { Input } from "./restaurants";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact & Accès — Riviera Ramatou Plage" },
      { name: "description", content: "Nous trouver : Baguida Beach, Lomé, Togo. Navette aéroport 24h/24. Réception 24/24." },
      { property: "og:title", content: "Contact & Accès — Riviera Ramatou Plage" },
      { property: "og:description", content: "Baguida Beach, Lomé. Aéroport 8 km, navette disponible 24h." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const s = useRiviera((x) => x.settings);
  const [f, setF] = useState({ name: "", email: "", subject: "Réservation", message: "" });
  const submit = () => {
    const msg = `CONTACT — ${f.subject}\nNom : ${f.name}\nEmail : ${f.email}\n\n${f.message}`;
    window.open(waLinkFromStore(msg, s.whatsapp), "_blank");
  };

  return (
    <SiteLayout>
      <section className="relative h-[55vh] min-h-[380px]">
        <img src="https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=2400&q=85" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/60" />
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-16">
          <div className="text-sand text-xs tracking-[0.4em] uppercase mb-3">Contact</div>
          <h1 className="font-display text-5xl md:text-7xl text-ivory">Nous Trouver</h1>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6 grid md:grid-cols-2 gap-12">
        <div>
          <h2 className="font-display text-3xl text-navy">Coordonnées</h2>
          <div className="mt-6 space-y-4 text-sm">
            <Info i={MapPin} l="Adresse" v={s.address} />
            <Info i={Phone} l="Téléphone" v={s.phone} />
            <Info i={Mail} l="Email" v={s.email} />
            <Info i={Instagram} l="Instagram" v={`@${s.instagram}`} />
            <Info i={Clock} l="Check-in / Check-out" v="13h00 – 16h00 / avant 12h00" />
            <Info i={Clock} l="Réception" v="24h/24" />
          </div>
        </div>
        <div>
          <h2 className="font-display text-3xl text-navy">Comment y arriver</h2>
          <div className="mt-6 grid sm:grid-cols-2 gap-3">
            <AccessCard i={Plane} t="Aéroport" d="Lomé-Tokoin — 8 km — ~20 min" />
            <AccessCard i={MapPin} t="Marché des Féticheurs" d="10 min en voiture" />
            <AccessCard i={Building} t="Centre-ville" d="15 min de Lomé" />
            <AccessCard i={Waves} t="Plage Baguida" d="Accès direct" />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 mb-12">
        <div className="rounded-3xl overflow-hidden shadow-elegant h-[400px]">
          <iframe
            title="Carte"
            width="100%" height="100%" loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.openstreetmap.org/export/embed.html?bbox=1.28%2C6.13%2C1.35%2C6.18&layer=mapnik&marker=6.155%2C1.31"
          />
        </div>
      </section>

      <section className="container mx-auto px-6 mb-16">
        <div className="bg-coral text-ivory rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <Plane size={48} />
            <div>
              <div className="font-display text-3xl">Navette aéroport — 20€/véhicule</div>
              <div className="text-ivory/80 text-sm mt-1">Disponible 24h/24, pré-réservation recommandée</div>
            </div>
          </div>
          <a
            href={waLinkFromStore("NAVETTE AEROPORT — Ramatou Plage\nNom : \nType : Arrivee / Depart\nDate & Heure : \nVol : \nPassagers : ", s.whatsapp)}
            target="_blank" rel="noreferrer"
            className="px-6 py-3 rounded-full bg-ivory text-coral font-medium">
            Réserver mon transfert
          </a>
        </div>
      </section>

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-6 max-w-3xl">
          <h2 className="text-center font-display text-4xl text-navy">Nous écrire</h2>
          <div className="mt-10 bg-card rounded-3xl p-8 border border-border grid md:grid-cols-2 gap-4">
            <Input label="Nom" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
            <Input label="Email" value={f.email} onChange={(v) => setF({ ...f, email: v })} type="email" />
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Sujet</label>
              <select value={f.subject} onChange={(e) => setF({ ...f, subject: e.target.value })}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-border outline-none bg-card">
                {["Réservation", "Événement", "Partenariat", "Autre"].map((x) => <option key={x}>{x}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea value={f.message} onChange={(e) => setF({ ...f, message: e.target.value })}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-border min-h-32 outline-none focus:border-ocean" />
            </div>
            <button onClick={submit} className="md:col-span-2 mt-2 px-6 py-3 rounded-full bg-coral text-ivory inline-flex items-center justify-center gap-2">
              <Send size={16} /> Envoyer
            </button>
          </div>
        </div>
      </section>

      <section className="py-16 container mx-auto px-6 max-w-3xl">
        <h2 className="text-center font-display text-4xl text-navy mb-8">Questions fréquentes</h2>
        <Accordion type="single" collapsible className="bg-card rounded-2xl border border-border px-6">
          {[
            ["Proposez-vous le petit-déjeuner ?", "Oui, 7€/adulte, servi de 7h30 à 11h00 au restaurant."],
            ["Y a-t-il un parking ?", "Oui, parking gratuit et sécurisé pour tous les résidents."],
            ["Acceptez-vous les animaux ?", "Non, les animaux ne sont pas admis dans l'hôtel."],
            ["La plage est-elle privée ?", "Oui, l'accès à la plage est réservé aux résidents de l'hôtel."],
            ["Comment réserver une navette ?", "Via WhatsApp ou directement à la réception, disponible 24h/24."],
          ].map(([q, a], i) => (
            <AccordionItem key={i} value={`i${i}`}>
              <AccordionTrigger className="text-left text-navy">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>
    </SiteLayout>
  );
}

function Info({ i: I, l, v }: { i: typeof Phone; l: string; v: string }) {
  return (
    <div className="flex items-start gap-3">
      <I size={18} className="text-ocean mt-0.5" />
      <div>
        <div className="text-xs uppercase tracking-widest text-muted-foreground">{l}</div>
        <div className="text-navy font-medium">{v}</div>
      </div>
    </div>
  );
}

function AccessCard({ i: I, t, d }: { i: typeof Plane; t: string; d: string }) {
  return (
    <div className="bg-card border border-border rounded-2xl p-5">
      <I className="text-coral" size={22} />
      <div className="font-display text-lg text-navy mt-2">{t}</div>
      <div className="text-sm text-muted-foreground mt-1">{d}</div>
    </div>
  );
}
