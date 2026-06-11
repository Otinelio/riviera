import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import SiteLayout from "@/components/site/SiteLayout";
import { Users, Wine, Heart, BookOpen, Send } from "lucide-react";
import { useRiviera, waLinkFromStore } from "@/store/riviera";
import { Input } from "./restaurants";

export const Route = createFileRoute("/evenements")({
  head: () => ({
    meta: [
      { title: "Événements & Réunions — Riviera Ramatou Plage" },
      { name: "description", content: "Conférences, séminaires, cocktails, mariages au bord de l'Atlantique. 2 salles jusqu'à 250m²." },
      { property: "og:title", content: "Vos Événements au Bord de l'Atlantique" },
      { property: "og:description", content: "Conférences, séminaires, mariages — espaces modulables face à la mer." },
    ],
  }),
  component: EvenementsPage,
});

const types = [
  { i: Users, t: "Conférences & Séminaires", d: "Espaces modulables avec AV complet" },
  { i: Wine, t: "Cocktails & Réceptions", d: "Terrasse jusqu'à 200 personnes" },
  { i: Heart, t: "Mariages & Célébrations", d: "Décoration sur mesure" },
  { i: BookOpen, t: "Formations & Ateliers", d: "Salles équipées en U ou classe" },
];

function EvenementsPage() {
  const whatsapp = useRiviera((s) => s.settings.whatsapp);
  const [f, setF] = useState({ name: "", company: "", email: "", phone: "", date: "", type: "Réunion", guests: "", duration: "", needs: "" });
  const submit = () => {
    const msg = `DEMANDE EVENEMENT — Ramatou Plage\nContact : ${f.name}\nStructure : ${f.company}\nEmail : ${f.email}\nTel : ${f.phone}\nDate : ${f.date}\nType : ${f.type}\nParticipants : ${f.guests}\nDuree : ${f.duration}\nBesoins : ${f.needs}`;
    window.open(waLinkFromStore(msg, whatsapp), "_blank");
  };

  return (
    <SiteLayout>
      <section className="relative h-[70vh] min-h-[480px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=2400&q=85" alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-navy/70" />
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-20">
          <div className="text-sand text-xs tracking-[0.4em] uppercase mb-3">Événements</div>
          <h1 className="font-display text-5xl md:text-7xl text-ivory text-balance">Vos Événements au Bord de l'Atlantique</h1>
          <p className="mt-4 text-ivory/80 text-lg">Conférences, séminaires, cocktails, mariages — tout est possible</p>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-5">
          {types.map(({ i: I, t, d }) => (
            <div key={t} className="bg-card rounded-2xl p-6 border border-border hover:border-coral transition">
              <I className="text-coral" size={28} />
              <div className="font-display text-xl text-navy mt-4">{t}</div>
              <p className="text-sm text-muted-foreground mt-2">{d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-8">
          <VenueSpec n="Salle 1" m="120m²" cap={["80 théâtre", "50 classe", "30 en U"]} />
          <VenueSpec n="Salle 2" m="130m²" cap={["100 théâtre", "60 classe", "40 en U"]} />
          <VenueSpec n="Terrasse extérieure" m="Cocktail" cap={["Jusqu'à 200 personnes"]} />
          <VenueSpec n="Équipement" m="Inclus" cap={["Vidéoprojecteur HD", "Système son & micro sans fil", "Tableau blanc, flip chart"]} />
        </div>
      </section>

      <section className="py-20 container mx-auto px-6 text-center max-w-2xl mx-auto">
        <h2 className="font-display text-4xl text-navy">Demandez un devis personnalisé</h2>
        <p className="text-muted-foreground mt-3">Chaque événement est unique. Contactez-nous pour une proposition adaptée à vos besoins.</p>
      </section>

      <section className="py-12 bg-muted/40">
        <div className="container mx-auto px-6 max-w-3xl">
          <div className="bg-card rounded-3xl p-8 border border-border grid md:grid-cols-2 gap-4">
            <Input label="Nom" value={f.name} onChange={(v) => setF({ ...f, name: v })} />
            <Input label="Entreprise / Organisation" value={f.company} onChange={(v) => setF({ ...f, company: v })} />
            <Input label="Email" value={f.email} onChange={(v) => setF({ ...f, email: v })} type="email" />
            <Input label="Téléphone" value={f.phone} onChange={(v) => setF({ ...f, phone: v })} />
            <Input label="Date événement" value={f.date} onChange={(v) => setF({ ...f, date: v })} type="date" />
            <div>
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Type d'événement</label>
              <select value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-border outline-none focus:border-ocean bg-card">
                {["Réunion", "Conférence", "Cocktail", "Mariage", "Formation", "Autre"].map(x => <option key={x}>{x}</option>)}
              </select>
            </div>
            <Input label="Nombre de participants" value={f.guests} onChange={(v) => setF({ ...f, guests: v })} type="number" />
            <Input label="Durée" value={f.duration} onChange={(v) => setF({ ...f, duration: v })} placeholder="ex: 1 journée" />
            <div className="md:col-span-2">
              <label className="text-xs uppercase tracking-widest text-muted-foreground">Besoins spéciaux</label>
              <textarea value={f.needs} onChange={(e) => setF({ ...f, needs: e.target.value })}
                className="mt-1 w-full px-4 py-3 rounded-xl border border-border min-h-24 outline-none focus:border-ocean"
                placeholder="Catering, hébergement, AV, décoration..." />
            </div>
            <button onClick={submit} className="md:col-span-2 mt-2 px-6 py-3 rounded-full bg-coral text-ivory inline-flex items-center justify-center gap-2">
              <Send size={16} /> Envoyer ma demande
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <h2 className="text-center font-display text-4xl text-navy mb-10">Événements passés</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            "1505373877841-8d25f7d46678", "1519671482749-fd09be7ccebf",
            "1511795409834-ef04bbd61622", "1540317580384-e5d43616b9aa",
            "1530023367847-a683933f4172", "1517457373958-b7bdd4587205",
          ].map((id) => (
            <img key={id} src={`https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1200&q=80`}
              alt="" className="rounded-2xl h-56 w-full object-cover" loading="lazy" />
          ))}
        </div>
      </section>

      <section className="py-16 bg-navy text-ivory">
        <div className="container mx-auto px-6 max-w-3xl text-center">
          <div className="font-accent italic text-3xl text-ivory/90">« Cadre exceptionnel pour notre séminaire annuel. Equipe attentive, vue mer inoubliable. »</div>
          <div className="mt-4 text-sand text-sm">— Direction RH, entreprise locale</div>
        </div>
      </section>
    </SiteLayout>
  );
}

function VenueSpec({ n, m, cap }: { n: string; m: string; cap: string[] }) {
  return (
    <div className="bg-card rounded-2xl border border-border p-6">
      <div className="flex justify-between items-baseline">
        <div className="font-display text-2xl text-navy">{n}</div>
        <div className="text-coral font-medium">{m}</div>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
        {cap.map((c) => <li key={c} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-coral mt-2" /> {c}</li>)}
      </ul>
    </div>
  );
}
