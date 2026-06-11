import { createFileRoute, Link } from "@tanstack/react-router";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { useRiviera, waLinkFromStore } from "@/store/riviera";
import { Waves, Plane, Droplets, Leaf, Building2, Wifi, Car, UtensilsCrossed, Coffee, Shirt, BellRing, Snowflake } from "lucide-react";

export const Route = createFileRoute("/experiences")({
  head: () => ({
    meta: [
      { title: "Expériences & Services — Riviera Ramatou Plage" },
      { name: "description", content: "Piscine, plage privée, navette aéroport, parc aquatique, wellness. Votre parenthèse tropicale à Lomé." },
      { property: "og:title", content: "Expériences & Services — Riviera Ramatou Plage" },
      { property: "og:description", content: "Votre parenthèse tropicale au bord de l'Atlantique." },
    ],
  }),
  component: ExperiencesPage,
});

const sections = [
  {
    icon: Waves, title: "Piscine & Plage Privée",
    desc: "Profitez de notre piscine extérieure et de l'accès direct à la plage Atlantique. Service au bord du bassin, transats, serviettes de plage fournies.",
    info: ["Ouverte 08h00 – 18h00", "Service bar à la piscine", "Transats & parasols", "Accès direct plage privée"],
    image: "https://images.unsplash.com/photo-1540202404-1b927e27fa8b?auto=format&fit=crop&w=1600&q=85",
    cta: "Réserver un transat",
    msg: "Bonjour, je souhaite réserver un transat à la piscine.",
  },
  {
    icon: Plane, title: "Navette & Transport",
    desc: "Notre navette aéroport vous accueille 24h/24, 7j/7. City tours sur demande pour découvrir Lomé en toute simplicité.",
    info: ["20€ / véhicule", "Disponible 24h/24", "Pré-réservation requise", "City tours sur demande"],
    image: "https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?auto=format&fit=crop&w=1600&q=85",
    cta: "Réserver la navette",
    msg: "NAVETTE AEROPORT — Ramatou Plage\nNom : \nChambre : \nType : Arrivee / Depart\nDate & Heure : \nVol : \nPassagers : ",
  },
  {
    icon: Droplets, title: "Parc Aquatique & Club Enfants",
    desc: "Splash zone avec toboggans, activités pour enfants supervisées, club enfants animé toute la journée.",
    info: ["Toboggans aquatiques", "Activités encadrées 3–12 ans", "Ouvert 10h – 17h"],
    image: "https://images.unsplash.com/photo-1551763729-58ec22ba6a3a?auto=format&fit=crop&w=1600&q=85",
    cta: "En savoir plus",
    msg: "Bonjour, je souhaite plus d'informations sur le club enfants.",
  },
  {
    icon: Leaf, title: "Wellness & Détente",
    desc: "Promenades dans le jardin tropical, hamacs, espaces lounge pour admirer le coucher de soleil. Services de massage disponibles sur demande à la réception.",
    info: ["Jardin tropical 24/24", "Hamacs ombragés", "Spots couchers de soleil", "Massage sur demande"],
    image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85",
    cta: "Demander un massage",
    msg: "Bonjour, je souhaite réserver un massage.",
  },
  {
    icon: Building2, title: "Salles de Réunion",
    desc: "2 salles équipées jusqu'à 250m² combinés, AV complet, catering possible. Idéal pour séminaires, conférences et formations.",
    info: ["2 salles modulables", "Vidéoprojecteur, son, micro", "Catering sur mesure"],
    image: "https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1600&q=85",
    cta: "Voir les détails",
    msg: "",
    link: "/evenements",
  },
];

const services = [
  { i: Wifi, l: "WiFi gratuit" }, { i: Car, l: "Parking" }, { i: BellRing, l: "Room Service 24h" },
  { i: Coffee, l: "Petit-déjeuner" }, { i: Plane, l: "Navette" }, { i: Shirt, l: "Blanchisserie" },
  { i: UtensilsCrossed, l: "Réception 24h" }, { i: Snowflake, l: "Climatisation" },
];

function ExperiencesPage() {
  const whatsapp = useRiviera((s) => s.settings.whatsapp);
  return (
    <SiteLayout>
      <section className="relative h-[80vh] min-h-[520px] overflow-hidden">
        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=2400&q=85"
          alt="" className="absolute inset-0 w-full h-full object-cover animate-[kenburns_18s_ease-in-out_infinite]" />
        <div className="absolute inset-0 bg-gradient-to-b from-navy/30 via-navy/30 to-navy/80" />
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-end pb-20">
          <div className="text-sand text-xs tracking-[0.4em] uppercase mb-3">Expériences</div>
          <h1 className="font-display text-5xl md:text-7xl text-ivory text-balance">Votre Parenthèse Tropicale</h1>
          <div className="mt-6 flex flex-wrap gap-3">
            {["Piscine", "Plage Privée", "Jardin Tropical", "Spa & Détente"].map((b) => (
              <span key={b} className="px-4 py-2 rounded-full bg-ivory/10 backdrop-blur text-ivory text-sm border border-ivory/20">{b}</span>
            ))}
          </div>
        </div>
      </section>

      <div className="py-20 container mx-auto px-6 space-y-24">
        {sections.map((s, i) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className={`grid md:grid-cols-2 gap-10 items-center ${i % 2 ? "md:[&>div:first-child]:order-2" : ""}`}>
              <div className="relative h-[400px] rounded-3xl overflow-hidden shadow-elegant">
                <img src={s.image} alt={s.title} className="w-full h-full object-cover" />
              </div>
              <div>
                <Icon className="text-coral" size={28} />
                <h2 className="font-display text-4xl text-navy mt-3">{s.title}</h2>
                <p className="text-foreground/80 mt-4 leading-relaxed">{s.desc}</p>
                <ul className="mt-5 grid grid-cols-2 gap-2 text-sm text-navy">
                  {s.info.map((x) => <li key={x} className="flex items-start gap-2"><span className="w-1.5 h-1.5 rounded-full bg-coral mt-2" /> {x}</li>)}
                </ul>
                {s.link ? (
                  <Link to={s.link} className="inline-flex mt-7 px-6 py-3 rounded-full bg-navy text-ivory">{s.cta}</Link>
                ) : (
                  <a href={waLinkFromStore(s.msg, whatsapp)} target="_blank" rel="noreferrer"
                    className="inline-flex mt-7 px-6 py-3 rounded-full bg-coral text-ivory">{s.cta}</a>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <section className="py-20 bg-muted/40">
        <div className="container mx-auto px-6">
          <h2 className="text-center font-display text-4xl text-navy mb-12">Services Inclus</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {services.map(({ i: I, l }) => (
              <div key={l} className="bg-card rounded-2xl p-6 border border-border text-center">
                <I className="mx-auto text-ocean" size={28} />
                <div className="mt-3 font-medium text-navy">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 container mx-auto px-6 max-w-3xl">
        <h2 className="text-center font-display text-4xl text-navy mb-10">Tarifs</h2>
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {[
            ["Petit-déjeuner adulte", "7€"], ["Petit-déjeuner enfant", "7€"],
            ["Navette aéroport", "20€ / véhicule"], ["Lit d'appoint", "10€ / séjour"],
            ["Accès piscine résidents", "Inclus"],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between p-5 border-b border-border last:border-0">
              <span className="text-navy">{l}</span><span className="text-coral font-medium">{v}</span>
            </div>
          ))}
        </div>
      </section>
    </SiteLayout>
  );
}
