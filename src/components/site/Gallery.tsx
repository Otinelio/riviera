import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { galleryImages } from "@/data/hotel";
import { SectionHeading } from "./RoomsSection";
import { X } from "lucide-react";

const cats = ["Tout", "Chambres", "Piscine", "Plage", "Restaurants", "Événements"];

export default function Gallery() {
  const [cat, setCat] = useState("Tout");
  const [light, setLight] = useState<string | null>(null);
  const filtered = cat === "Tout" ? galleryImages : galleryImages.filter(g => g.cat === cat || (cat === "Piscine" && g.cat === "Piscine"));

  return (
    <section id="galerie" className="py-24 bg-muted">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Galerie" title="L'hôtel en images" desc="Plongez dans l'univers de Ramatou Plage." />

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)}
              className={`px-5 py-2 rounded-full text-sm transition-all ${cat === c ? "bg-ocean text-ivory" : "bg-card border border-border text-foreground hover:border-ocean"}`}>
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4">
          {filtered.map((img, i) => (
            <motion.button
              key={img.src}
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: (i % 8) * 0.05 }}
              onClick={() => setLight(img.src)}
              className="block w-full break-inside-avoid overflow-hidden rounded-2xl group relative"
            >
              <img src={img.src} alt={img.alt} className="w-full group-hover:scale-105 transition-transform duration-500" loading="lazy" />
              <div className="absolute inset-0 bg-navy/0 group-hover:bg-navy/30 transition-colors" />
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {light && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-navy/95 flex items-center justify-center p-4" onClick={() => setLight(null)}>
            <button className="absolute top-6 right-6 text-ivory"><X /></button>
            <img src={light} className="max-w-full max-h-full rounded-2xl shadow-elegant" alt="" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
