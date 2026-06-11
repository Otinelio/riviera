import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./RoomsSection";
import { waLink } from "@/lib/hotel";
import { Building2, Users, Coffee, Projector } from "lucide-react";

export default function Events() {
  const [f, setF] = useState({ name: "", company: "", date: "", participants: "", type: "Réunion", needs: "" });
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `🏢 *DEMANDE ÉVÉNEMENT*
─────────────────────
👤 Contact : ${f.name}
🏢 Structure : ${f.company}
📅 Date : ${f.date}
👥 Participants : ${f.participants}
📋 Type : ${f.type}
📝 Besoins : ${f.needs || "—"}`;
    window.open(waLink(msg), "_blank");
  };

  return (
    <section id="evenements" className="py-24 bg-ivory">
      <div className="container mx-auto px-6">
        <SectionHeading eyebrow="Événements" title="Organisez votre événement" desc="2 salles de réunion, 250m² modulables, terrasse extérieure et catering sur mesure." />

        <div className="mt-16 grid md:grid-cols-2 gap-12">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="relative h-96 rounded-3xl overflow-hidden shadow-elegant">
              <img src="https://images.unsplash.com/photo-1551918120-9739cb430c6d?auto=format&fit=crop&w=1400&q=80" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              {[
                { icon: Building2, label: "250m² modulables" },
                { icon: Users, label: "Jusqu'à 200 pers." },
                { icon: Projector, label: "Équipement AV" },
                { icon: Coffee, label: "Catering sur mesure" },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3 p-4 rounded-xl bg-muted">
                  <Icon className="text-ocean" size={20} /> <span className="text-sm">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.form initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} onSubmit={submit}
            className="grid gap-4 bg-card p-8 rounded-3xl shadow-soft border border-border">
            <input required placeholder="Nom complet" value={f.name} onChange={e => setF({...f, name: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none focus:border-ocean" />
            <input placeholder="Entreprise / structure" value={f.company} onChange={e => setF({...f, company: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none focus:border-ocean" />
            <div className="grid grid-cols-2 gap-3">
              <input required type="date" value={f.date} onChange={e => setF({...f, date: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none" />
              <input required type="number" placeholder="Participants" value={f.participants} onChange={e => setF({...f, participants: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none" />
            </div>
            <select value={f.type} onChange={e => setF({...f, type: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none">
              {["Réunion", "Cocktail", "Conférence", "Mariage", "Séminaire", "Autre"].map(o => <option key={o}>{o}</option>)}
            </select>
            <textarea placeholder="Vos besoins spécifiques" value={f.needs} onChange={e => setF({...f, needs: e.target.value})} className="border border-border rounded-xl px-4 py-3 outline-none min-h-28" />
            <button className="bg-coral text-ivory rounded-full py-3.5 font-medium hover:scale-[1.02] transition-transform">Demander un devis</button>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
