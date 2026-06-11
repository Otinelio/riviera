import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import SiteLayout, { PageHero } from "@/components/site/SiteLayout";
import { rooms as roomData } from "@/data/hotel";
import { useRiviera, waLinkFromStore } from "@/store/riviera";
import { Bed, BedDouble, Wifi, Tv, Droplets, Snowflake, Wine, Lock, Briefcase, Moon, Sun, Phone, Check, ChevronLeft, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/chambres")({
  head: () => ({
    meta: [
      { title: "Chambres & Suites — Riviera Ramatou Plage" },
      { name: "description", content: "15 chambres et suites face à l'Atlantique. Vue mer, vue jardin, suites avec kitchenette à Lomé." },
      { property: "og:title", content: "Nos Chambres & Suites — Riviera Ramatou Plage" },
      { property: "og:description", content: "15 hébergements pensés pour votre confort, face à l'océan Atlantique." },
    ],
  }),
  component: ChambresPage,
});

type Filter = "all" | "garden" | "sea" | "suite" | "available";
type SortKey = "price-asc" | "price-desc" | "area";

const detail = [
  { id: "double-standard", area: 22, occ: 2, floor: "RDC ou 1er étage", view: "Vue jardin tropical", icon: Bed },
  { id: "double-vue-mer", area: 26, occ: 2, floor: "1er ou 2e étage", view: "Vue océan Atlantique", icon: BedDouble },
  { id: "suite-kitchenette", area: 38, occ: 4, floor: "2e étage avec balcon", view: "Vue mer ou jardin", icon: BedDouble },
];

const amenityIcons: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  WiFi: Wifi, TV: Tv, Douche: Droplets, Climatisation: Snowflake, Minibar: Wine,
  Coffre: Lock, Bureau: Briefcase, Rideaux: Moon, Balcon: Sun, Cuisine: Wine, Service: Phone,
};

const baseAmenities = [
  "WiFi gratuit", "TV LCD", "Douche effet pluie", "Climatisation",
  "Minibar", "Coffre-fort", "Bureau de travail", "Rideaux occultants",
  "Room service 24h", "Lit d'appoint disponible (+10€)",
];

function getIcon(label: string) {
  const key = Object.keys(amenityIcons).find((k) => label.includes(k));
  return key ? amenityIcons[key] : Check;
}

function ChambresPage() {
  const [filter, setFilter] = useState<Filter>("all");
  const [sort, setSort] = useState<SortKey>("price-asc");
  const settings = useRiviera((s) => s.settings);

  const filtered = useMemo(() => {
    let list = [...roomData];
    if (filter === "garden") list = list.filter((r) => r.view.toLowerCase().includes("jardin"));
    if (filter === "sea") list = list.filter((r) => r.view.toLowerCase().includes("mer") || r.view.toLowerCase().includes("océan"));
    if (filter === "suite") list = list.filter((r) => r.id.includes("suite"));
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    if (sort === "area") {
      const ar = (id: string) => detail.find((d) => d.id === id)?.area ?? 0;
      list.sort((a, b) => ar(b.id) - ar(a.id));
    }
    return list;
  }, [filter, sort]);

  return (
    <SiteLayout>
      <PageHero
        image="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2400&q=85"
        breadcrumb="Accueil / Chambres & Suites"
        eyebrow="Hébergements"
        title="Nos Hébergements"
        subtitle="15 chambres et suites face à l'Atlantique"
      />

      <div className="sticky top-16 z-30 bg-ivory/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            {([
              ["all", "Toutes"], ["garden", "Vue Jardin"], ["sea", "Vue Mer"],
              ["suite", "Suite"], ["available", "Disponibles maintenant"],
            ] as [Filter, string][]).map(([k, l]) => (
              <button
                key={k}
                onClick={() => setFilter(k)}
                className={`px-4 py-2 rounded-full text-sm transition ${
                  filter === k ? "bg-navy text-ivory" : "bg-muted text-navy hover:bg-muted/70"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="px-4 py-2 rounded-full text-sm bg-card border border-border"
          >
            <option value="price-asc">Prix croissant</option>
            <option value="price-desc">Prix décroissant</option>
            <option value="area">Superficie</option>
          </select>
        </div>
      </div>

      <div className="py-20 container mx-auto px-6 space-y-24">
        {filtered.map((r, i) => {
          const d = detail.find((x) => x.id === r.id)!;
          const Icon = d.icon;
          return (
            <RoomSection key={r.id} room={r} d={d} Icon={Icon} reverse={i % 2 === 1} whatsapp={settings.whatsapp} />
          );
        })}
      </div>

      <section className="bg-muted/40 py-20">
        <div className="container mx-auto px-6 grid md:grid-cols-4 gap-6">
          <PolicyCard title="Arrivée" body="13h00 – 16h00" />
          <PolicyCard title="Départ" body="avant 12h00" />
          <PolicyCard title="Petit-déjeuner" body="7€/adulte, 7€/enfant — 7h30 à 11h" />
          <PolicyCard title="Lit d'appoint" body="10€ / séjour" />
        </div>
      </section>

      <section className="py-20 container mx-auto px-6">
        <h2 className="font-display text-4xl text-navy text-center mb-12">Comparatif</h2>
        <div className="overflow-x-auto rounded-2xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-navy text-ivory">
              <tr>
                <th className="text-left p-4">Caractéristique</th>
                {roomData.map((r) => <th key={r.id} className="p-4 text-left">{r.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {[
                ["Surface", roomData.map((r) => `${detail.find((d) => d.id === r.id)?.area}m²`)],
                ["Vue", roomData.map((r) => r.view)],
                ["Lit", roomData.map((r) => r.bed)],
                ["Occupation max", roomData.map((r) => `${detail.find((d) => d.id === r.id)?.occ} pers.`)],
                ["Prix / nuit", roomData.map((r) => `${r.price}€`)],
              ].map(([label, vals]) => (
                <tr key={label as string} className="border-t border-border hover:bg-muted/40">
                  <td className="p-4 font-medium text-navy">{label}</td>
                  {(vals as string[]).map((v, i) => <td key={i} className="p-4 text-muted-foreground">{v}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </SiteLayout>
  );
}

function PolicyCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="bg-card rounded-2xl p-6 border border-border">
      <div className="text-xs uppercase tracking-[0.3em] text-coral">{title}</div>
      <div className="mt-2 font-display text-xl text-navy">{body}</div>
    </div>
  );
}

function RoomSection({ room, d, Icon, reverse, whatsapp }: { room: typeof roomData[number]; d: typeof detail[number]; Icon: React.ComponentType<{ size?: number; className?: string }>; reverse: boolean; whatsapp: string }) {
  const [idx, setIdx] = useState(0);
  return (
    <article className={`grid md:grid-cols-2 gap-10 items-center ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}>
      <div className="relative h-[480px] rounded-3xl overflow-hidden shadow-elegant group">
        <img src={room.images[idx]} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        <button onClick={() => setIdx((i) => (i - 1 + room.images.length) % room.images.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ivory/90 flex items-center justify-center">
          <ChevronLeft size={18} />
        </button>
        <button onClick={() => setIdx((i) => (i + 1) % room.images.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-ivory/90 flex items-center justify-center">
          <ChevronRight size={18} />
        </button>
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
          {room.images.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`w-2 h-2 rounded-full ${i === idx ? "bg-ivory" : "bg-ivory/40"}`} />
          ))}
        </div>
      </div>
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-ocean/10 text-ocean text-xs uppercase tracking-widest">
          <Icon size={14} /> {d.view}
        </div>
        <h2 className="font-display text-4xl text-navy mt-4">{room.name}</h2>
        <p className="text-muted-foreground mt-3 leading-relaxed">{room.description}</p>
        <div className="mt-6 grid grid-cols-2 gap-3 text-sm">
          <Spec label="Surface" value={`${d.area} m²`} />
          <Spec label="Lit" value={room.bed} />
          <Spec label="Occupation" value={`${d.occ} personnes`} />
          <Spec label="Étage" value={d.floor} />
        </div>
        <div className="mt-6">
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Équipements</div>
          <ul className="grid grid-cols-2 gap-2">
            {baseAmenities.map((a) => {
              const I = getIcon(a);
              return (
                <li key={a} className="flex items-center gap-2 text-sm text-foreground/80">
                  <I size={14} className="text-tropical" /> {a}
                </li>
              );
            })}
          </ul>
        </div>
        <div className="mt-8 flex items-end justify-between border-t border-border pt-6">
          <div>
            <div className="text-4xl font-display text-coral">{room.price}€<span className="text-sm text-muted-foreground"> /nuit</span></div>
          </div>
          <div className="flex gap-2">
            <Link to="/contact" className="px-4 py-2.5 rounded-full text-sm border border-border hover:border-ocean">Disponibilités</Link>
            <a
              href={waLinkFromStore(`RESERVATION — ${room.name} (${room.price}€/nuit). Bonjour, je souhaite réserver.`, whatsapp)}
              target="_blank" rel="noreferrer"
              className="px-5 py-2.5 rounded-full text-sm bg-coral text-ivory font-medium hover:scale-105 transition-transform"
            >
              Réserver cette chambre
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className="font-medium text-navy">{value}</div>
    </div>
  );
}
