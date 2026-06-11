import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./RoomsSection";
import { waLink } from "@/lib/hotel";

export default function Restaurants() {
  const [open, setOpen] = useState(false);
  return (
    <section id="restaurants" className="py-24 bg-navy text-ivory relative overflow-hidden">
      <div className="container mx-auto px-6 relative">
        <SectionHeading
          eyebrow="Gastronomie"
          title="Restaurants & Bar"
          desc="De la paillote ouverte sur l'océan à notre salle climatisée — saveurs locales et internationales."
          light
        />
        <div className="mt-16 grid md:grid-cols-2 gap-6">
          <Card
            img="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=1400&q=80"
            tag="Pieds dans le sable"
            title="Paillote Atlantique"
            desc="Cuisine en plein air sous les cocotiers. Petit-déjeuner continental, asiatique et végétarien servi de 7h30 à 11h, face à l'océan."
          />
          <Card
            img="https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1400&q=80"
            tag="Climatisé"
            title="Restaurant Indoor"
            desc="Cuisine locale & internationale dans un cadre raffiné. Formule buffet enfants disponible. Réservations conseillées le week-end."
          />
        </div>

        <div className="mt-12 text-center">
          <button onClick={() => setOpen(true)} className="px-8 py-4 rounded-full bg-coral text-ivory hover:scale-105 transition-transform shadow-elegant">
            Réserver une table
          </button>
        </div>
      </div>

      {open && <TableModal onClose={() => setOpen(false)} />}
    </section>
  );
}

function Card({ img, tag, title, desc }: { img: string; tag: string; title: string; desc: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="group relative rounded-3xl overflow-hidden h-96"
    >
      <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <span className="self-start text-[10px] uppercase tracking-widest px-3 py-1 rounded-full glass mb-3">{tag}</span>
        <h3 className="font-display text-3xl">{title}</h3>
        <p className="text-sm text-ivory/80 mt-2">{desc}</p>
      </div>
    </motion.div>
  );
}

function TableModal({ onClose }: { onClose: () => void }) {
  const [f, setF] = useState({ name: "", date: "", time: "", people: "2", notes: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `🍽️ *RÉSERVATION TABLE*
*Ramatou Plage Restaurant*
─────────────────────
👤 Nom : ${f.name}
📅 Date : ${f.date} à ${f.time}
👥 Couverts : ${f.people}
📝 Occasion : ${f.notes || "—"}`;
    window.open(waLink(msg), "_blank");
    onClose();
  };
  return (
    <div className="fixed inset-0 z-[100] bg-navy/80 backdrop-blur flex items-center justify-center p-4" onClick={onClose}>
      <form onClick={(e) => e.stopPropagation()} onSubmit={submit} className="bg-ivory text-navy rounded-2xl max-w-md w-full p-8 grid gap-4">
        <h3 className="font-display text-2xl">Réserver une table</h3>
        <input required placeholder="Nom" value={f.name} onChange={e => setF({...f, name: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none focus:border-ocean" />
        <div className="grid grid-cols-2 gap-3">
          <input required type="date" value={f.date} onChange={e => setF({...f, date: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none" />
          <input required type="time" value={f.time} onChange={e => setF({...f, time: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none" />
        </div>
        <input type="number" min="1" value={f.people} onChange={e => setF({...f, people: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none" placeholder="Couverts" />
        <textarea placeholder="Occasion / demandes" value={f.notes} onChange={e => setF({...f, notes: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none min-h-20" />
        <button className="bg-coral text-ivory rounded-full py-3 font-medium">Envoyer via WhatsApp</button>
      </form>
    </div>
  );
}
