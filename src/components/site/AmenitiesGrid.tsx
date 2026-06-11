import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { amenities } from "@/data/hotel";
import { SectionHeading } from "./RoomsSection";

export default function AmenitiesGrid() {
  return (
    <section className="py-24 bg-gradient-to-b from-ivory to-muted">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Services" title="Tout pour votre confort" desc="Une palette complète de services pensés pour transformer votre séjour en parenthèse de bien-être." />
        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {amenities.map((a, i) => {
            const Icon = (Icons as any)[a.icon] ?? Icons.Sparkles;
            return (
              <motion.div
                key={a.label}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: (i % 8) * 0.05 }}
                className="group p-6 rounded-2xl bg-card hover:bg-ocean hover:text-ivory transition-all duration-500 cursor-default border border-border hover:border-ocean shadow-soft hover:shadow-elegant hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-xl bg-ocean/10 group-hover:bg-ivory/20 flex items-center justify-center mb-4 transition-colors">
                  <Icon size={22} className="text-ocean group-hover:text-ivory transition-colors" />
                </div>
                <div className="font-display text-lg leading-tight">{a.label}</div>
                <div className="text-xs text-muted-foreground group-hover:text-ivory/70 mt-1 transition-colors">{a.note}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
