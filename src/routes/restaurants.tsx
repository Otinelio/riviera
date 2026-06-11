import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useRiviera, waLinkFromStore } from "@/store/riviera";
import { Clock, UtensilsCrossed, Wine, QrCode, Send } from "lucide-react";

export const Route = createFileRoute("/restaurants")({
  head: () => ({
    meta: [
      { title: "Restaurants & Bar — Riviera Ramatou Plage" },
      { name: "description", content: "Paillote face à l'Atlantique et restaurant indoor climatisé. Cuisine locale et internationale à Lomé." },
      { property: "og:title", content: "Restaurants & Bar — Riviera Ramatou Plage" },
      { property: "og:description", content: "Saveurs locales, grillades, fruits de mer, cocktails tropicaux." },
    ],
  }),
  component: RestaurantsPage,
});

function RestaurantsPage() {
  const whatsapp = useRiviera((s) => s.settings.whatsapp);
  return (
    <SiteLayout>
      <section className="relative h-[80vh] min-h-[520px] overflow-hidden">
        <div className="absolute inset-0 grid grid-cols-2">
          <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1600&q=85" alt="" className="w-full h-full object-cover" />
          <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=85" alt="" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-navy/60 via-navy/40 to-navy/80" />
        <div className="relative h-full container mx-auto px-6 flex flex-col items-center justify-center text-center">
          <div className="text-sand text-xs tracking-[0.4em] uppercase mb-4">Gastronomie</div>
          <h1 className="font-accent italic text-5xl md:text-7xl text-ivory">Art de Vivre à la Togolaise</h1>
          <p className="mt-4 text-ivory/85 text-lg max-w-2xl">Saveurs locales & cuisine internationale, les pieds dans le sable</p>
        </div>
      </section>

      <Venue
        eyebrow="Bord de plage"
        title="Paillote Atlantique"
        desc="Sous les paillotes face à l'Atlantique, dégustez des grillades et poissons frais pêchés le matin même. Une expérience culinaire avec vue sur l'horizon."
        image="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=85"
        hours={["Petit-déjeuner 7h30 – 11h", "Déjeuner 12h – 15h", "Dîner 19h – 22h"]}
        tags={["Locale", "Grillade", "Fruits de mer", "Internationale"]}
        whatsapp={whatsapp}
      />
      <Venue
        eyebrow="Climatisé"
        title="Restaurant Indoor"
        desc="Dans un cadre climatisé et élégant, notre restaurant indoor propose une cuisine internationale raffinée et un buffet enfants disponible midi et soir."
        image="https://images.unsplash.com/photo-1592861956120-e524fc739696?auto=format&fit=crop&w=1600&q=85"
        hours={["Petit-déjeuner 7h30 – 11h", "Déjeuner 12h – 15h", "Dîner 19h – 22h"]}
        tags={["Buffet Enfants", "Menu Business", "Cuisine végétarienne"]}
        reverse
        whatsapp={whatsapp}
      />

      <section className="bg-navy text-ivory py-24">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="text-sand text-xs uppercase tracking-[0.4em] mb-3">Bar & Salon</div>
            <h2 className="font-display text-5xl">Cocktails Signature</h2>
            <p className="text-ivory/70 mt-3 max-w-2xl mx-auto">Ouvert tous les jours de 10h à 23h</p>
          </div>
          <div className="mt-12 grid md:grid-cols-3 gap-6">
            {[
              ["Punch Atlantique", "Rhum, fruits tropicaux, sirop maison"],
              ["Mojito Tropical", "Menthe fraîche, citron vert, sucre de canne"],
              ["Tonic Lomé", "Gin local, tonic, infusion bissap"],
            ].map(([n, d]) => (
              <div key={n} className="rounded-2xl bg-ivory/5 backdrop-blur border border-ivory/10 p-8">
                <Wine className="text-sand" />
                <div className="font-display text-2xl mt-4">{n}</div>
                <p className="text-ivory/70 text-sm mt-2">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto">
          <div className="text-coral text-xs uppercase tracking-[0.4em] mb-3">Petit-Déjeuner</div>
          <h2 className="font-display text-4xl text-navy">Bien commencer la journée</h2>
          <p className="text-muted-foreground mt-3">7€/adulte — 7€/enfant • Servi 7h30 à 11h00</p>
        </div>
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          {[
            { t: "Continental", img: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=1200&q=80" },
            { t: "Asiatique", img: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?auto=format&fit=crop&w=1200&q=80" },
            { t: "Végétarien", img: "https://images.unsplash.com/photo-1494390248081-4e521a5940db?auto=format&fit=crop&w=1200&q=80" },
          ].map((c) => (
            <div key={c.t} className="rounded-2xl overflow-hidden shadow-soft bg-card">
              <img src={c.img} alt={c.t} className="w-full h-56 object-cover" />
              <div className="p-5 font-display text-2xl text-navy">{c.t}</div>
            </div>
          ))}
        </div>
        <div className="mt-10 text-center">
          <a href={waLinkFromStore("Bonjour, je souhaite inclure le petit-déjeuner à mon séjour.", whatsapp)}
            target="_blank" rel="noreferrer"
            className="inline-flex px-6 py-3 rounded-full bg-coral text-ivory">
            Inclure le petit-déjeuner
          </a>
        </div>
      </section>

      <section className="py-16 container mx-auto px-6">
        <div className="bg-ocean text-ivory rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <QrCode size={56} />
            <div>
              <div className="font-display text-3xl">Scannez notre menu digital</div>
              <div className="text-ivory/80 text-sm mt-1">Disponible depuis votre chambre ou à table</div>
            </div>
          </div>
          <a href="/menu/restaurant" className="px-6 py-3 rounded-full bg-coral">Voir le menu</a>
        </div>
      </section>

      <TableForm whatsapp={whatsapp} />
    </SiteLayout>
  );
}

function Venue({ eyebrow, title, desc, image, hours, tags, reverse, whatsapp }: {
  eyebrow: string; title: string; desc: string; image: string; hours: string[]; tags: string[]; reverse?: boolean; whatsapp: string;
}) {
  return (
    <section className="py-20 container mx-auto px-6">
      <div className={`grid md:grid-cols-2 gap-12 items-center ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}>
        <div className="relative h-[460px] rounded-3xl overflow-hidden shadow-elegant">
          <img src={image} alt={title} className="w-full h-full object-cover" />
        </div>
        <div>
          <div className="text-sand text-xs uppercase tracking-[0.4em]">{eyebrow}</div>
          <h2 className="font-display text-5xl text-navy mt-3">{title}</h2>
          <p className="mt-4 text-foreground/80 leading-relaxed">{desc}</p>
          <div className="mt-6 space-y-2">
            {hours.map((h) => (
              <div key={h} className="flex items-center gap-2 text-sm text-navy"><Clock size={14} className="text-ocean" /> {h}</div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {tags.map((t) => <span key={t} className="text-xs px-3 py-1 rounded-full bg-tropical/10 text-tropical">{t}</span>)}
          </div>
          <a href={waLinkFromStore(`RESERVATION TABLE — ${title}. Bonjour, je souhaite réserver une table.`, whatsapp)}
            target="_blank" rel="noreferrer"
            className="inline-flex mt-7 px-6 py-3 rounded-full bg-navy text-ivory items-center gap-2">
            <UtensilsCrossed size={16} /> Réserver une table
          </a>
        </div>
      </div>
    </section>
  );
}

function TableForm({ whatsapp }: { whatsapp: string }) {
  const [f, setF] = useState({ name: "", date: "", time: "", guests: "2", occasion: "", notes: "" });
  const submit = () => {
    const msg = `RESERVATION TABLE — Ramatou Plage Restaurant\nNom : ${f.name}\nDate : ${f.date} a ${f.time}\nCouverts : ${f.guests}\nOccasion : ${f.occasion || "—"}\nNotes : ${f.notes || "—"}`;
    window.open(waLinkFromStore(msg, whatsapp), "_blank");
  };
  return (
    <section className="py-20 bg-muted/40">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center">
          <div className="text-coral text-xs uppercase tracking-[0.4em] mb-3">Réservation</div>
          <h2 className="font-display text-4xl text-navy">Réservez votre table</h2>
        </div>
        <div className="mt-10 bg-card rounded-3xl p-8 border border-border grid md:grid-cols-2 gap-4">
          <Input label="Nom" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
          <Input label="Couverts" value={f.guests} onChange={(v) => setF({ ...f, guests: v })} type="number" />
          <Input label="Date" value={f.date} onChange={(v) => setF({ ...f, date: v })} type="date" />
          <Input label="Heure" value={f.time} onChange={(v) => setF({ ...f, time: v })} type="time" />
          <div className="md:col-span-2">
            <Input label="Occasion" value={f.occasion} onChange={(v) => setF({ ...f, occasion: v })} placeholder="Anniversaire, repas d'affaires…" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs uppercase tracking-widest text-muted-foreground">Notes</label>
            <textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })}
              className="mt-1 w-full px-4 py-3 rounded-xl border border-border min-h-24 outline-none focus:border-ocean" />
          </div>
          <button onClick={submit} className="md:col-span-2 mt-2 px-6 py-3 rounded-full bg-coral text-ivory inline-flex items-center justify-center gap-2">
            <Send size={16} /> Envoyer ma réservation
          </button>
        </div>
      </div>
    </section>
  );
}

export function Input({ label, value, onChange, type = "text", placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs uppercase tracking-widest text-muted-foreground">{label}</label>
      <input type={type} value={value} placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-ocean bg-card" />
    </div>
  );
}
