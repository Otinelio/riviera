import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect, useCallback } from "react";
import SiteLayout from "@/components/site/SiteLayout";
import { galleryImages } from "@/data/hotel";
import { useRiviera } from "@/store/riviera";
import { Maximize2, X, ChevronLeft, ChevronRight, Mail } from "lucide-react";

export const Route = createFileRoute("/galerie")({
  head: () => ({
    meta: [
      { title: "Galerie Photo — Riviera Ramatou Plage" },
      { name: "description", content: "Découvrez en images l'univers du Riviera Ramatou Plage : chambres, piscine, plage, restaurants." },
      { property: "og:title", content: "Galerie — Riviera Ramatou Plage" },
      { property: "og:description", content: "Notre univers en images : Atlantique, jardin tropical, gastronomie." },
    ],
  }),
  component: GaleriePage,
});

const cats = ["Tout", "Chambres", "Piscine", "Plage", "Restaurants", "Événements"];

function GaleriePage() {
  const adminGallery = useRiviera((s) => s.gallery);
  const all = [
    ...galleryImages.map((g, i) => ({ id: `s-${i}`, src: g.src, caption: g.alt, category: g.cat })),
    ...adminGallery,
  ];
  const [cat, setCat] = useState("Tout");
  const [lightbox, setLightbox] = useState<number | null>(null);

  const filtered = cat === "Tout" ? all : all.filter((g) => g.category === cat);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") setLightbox(null);
      if (e.key === "ArrowRight") setLightbox((i) => (i! + 1) % filtered.length);
      if (e.key === "ArrowLeft") setLightbox((i) => (i! - 1 + filtered.length) % filtered.length);
    },
    [lightbox, filtered.length]
  );
  useEffect(() => {
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onKey]);

  return (
    <SiteLayout>
      <section className="relative h-[60vh] min-h-[400px]">
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1">
          {all.slice(0, 6).map((g) => <img key={g.id} src={g.src} alt="" className="w-full h-full object-cover" />)}
        </div>
        <div className="absolute inset-0 bg-navy/70 flex items-center justify-center">
          <div className="text-center">
            <div className="text-sand text-xs tracking-[0.4em] uppercase">Galerie</div>
            <h1 className="font-display text-5xl md:text-7xl text-ivory mt-3">Notre Univers en Images</h1>
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 bg-ivory/90 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex flex-wrap gap-2 justify-center">
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-4 py-2 rounded-full text-sm transition ${cat === c ? "bg-navy text-ivory" : "bg-muted text-navy"}`}>
              {c} {c !== "Tout" && <span className="ml-1 text-xs opacity-60">({all.filter((g) => g.category === c).length})</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 py-12">
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
          {filtered.map((g, i) => (
            <button key={g.id} onClick={() => setLightbox(i)} className="block w-full break-inside-avoid relative group">
              <img src={g.src} alt={g.caption ?? ""} loading="lazy"
                className="w-full rounded-2xl shadow-soft group-hover:scale-[1.02] transition-transform" />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/40 transition-colors rounded-2xl flex items-center justify-center">
                <Maximize2 className="text-ivory opacity-0 group-hover:opacity-100 transition" />
              </div>
            </button>
          ))}
        </div>
      </div>

      <section className="py-16 bg-muted/40">
        <div className="container mx-auto px-6 max-w-2xl text-center">
          <div className="text-coral text-xs uppercase tracking-[0.4em] mb-3">Presse & Médias</div>
          <h2 className="font-display text-3xl text-navy">Téléchargez notre kit presse</h2>
          <p className="text-muted-foreground mt-3">Logos haute résolution, photos institutionnelles, dossier de presse complet.</p>
          <a href="mailto:presse@ramatouplage.tg" className="inline-flex mt-6 px-6 py-3 rounded-full bg-navy text-ivory items-center gap-2">
            <Mail size={16} /> Demander le kit presse
          </a>
        </div>
      </section>

      {lightbox !== null && (
        <div className="fixed inset-0 z-[100] bg-navy/95 flex items-center justify-center p-4" onClick={() => setLightbox(null)}>
          <button onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! - 1 + filtered.length) % filtered.length); }}
            className="absolute left-4 w-12 h-12 rounded-full bg-ivory/10 text-ivory flex items-center justify-center"><ChevronLeft /></button>
          <img src={filtered[lightbox].src} alt="" className="max-h-[85vh] max-w-[90vw] object-contain rounded-xl" />
          <button onClick={(e) => { e.stopPropagation(); setLightbox((i) => (i! + 1) % filtered.length); }}
            className="absolute right-4 w-12 h-12 rounded-full bg-ivory/10 text-ivory flex items-center justify-center"><ChevronRight /></button>
          <button onClick={() => setLightbox(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-ivory/10 text-ivory flex items-center justify-center"><X /></button>
        </div>
      )}
    </SiteLayout>
  );
}
