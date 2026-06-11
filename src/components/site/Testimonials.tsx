import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { reviews } from "@/data/hotel";
import { SectionHeading } from "./RoomsSection";

export default function Testimonials() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI(p => (p + 1) % reviews.length), 5000);
    return () => clearInterval(t);
  }, []);
  const r = reviews[i];

  return (
    <section className="py-24 gradient-ocean text-ivory relative overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <SectionHeading eyebrow="Avis clients" title="Ils ont vécu l'expérience" light />
        <div className="mt-16 max-w-3xl mx-auto text-center min-h-[260px]">
          <Quote className="mx-auto text-sand mb-6" size={48} />
          <AnimatePresence mode="wait">
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}>
              <p className="font-accent text-2xl md:text-3xl text-balance leading-relaxed">"{r.text}"</p>
              <div className="mt-8 flex items-center justify-center gap-1">
                {Array.from({ length: r.rating }).map((_, k) => (
                  <motion.span key={k} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: k * 0.1 }}>
                    <Star size={20} className="fill-sand text-sand" />
                  </motion.span>
                ))}
              </div>
              <div className="mt-4 text-ivory/80">
                <span className="font-medium">{r.name}</span> · <span className="text-sm">{r.origin}</span>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="mt-10 flex justify-center gap-2">
            {reviews.map((_, k) => (
              <button key={k} onClick={() => setI(k)} className={`h-1 rounded-full transition-all ${k === i ? "w-10 bg-coral" : "w-5 bg-ivory/30"}`} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
