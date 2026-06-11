import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeading } from "./RoomsSection";
import { waLink } from "@/lib/hotel";

export default function BookingForm() {
  const [f, setF] = useState({
    name: "", phone: "", type: "Chambre Double Vue Mer", arrival: "", departure: "",
    people: "2", arrivalTime: "", notes: "",
  });
  const set = (k: string, v: string) => setF({ ...f, [k]: v });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const msg = `🏨 *DEMANDE DE RÉSERVATION*
*Hotel Riviera Ramatou Plage — Lomé*
─────────────────────
👤 Nom : ${f.name}
📞 Tél : ${f.phone}
🛏️ Chambre : ${f.type}
📅 Arrivée : ${f.arrival} | Départ : ${f.departure}
👥 Personnes : ${f.people}
📝 Notes : ${f.notes || "—"}
─────────────────────
⏰ Heure d'arrivée prévue : ${f.arrivalTime || "à préciser"}`;
    window.open(waLink(msg), "_blank");
  };

  return (
    <section id="booking" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 gradient-ocean" />
      <img src="https://images.unsplash.com/photo-1505228395891-9a51e7e86bf6?auto=format&fit=crop&w=2000&q=80" alt="" className="absolute inset-0 w-full h-full object-cover opacity-20 mix-blend-overlay" />
      <div className="container mx-auto px-6 relative">
        <SectionHeading eyebrow="Réservation" title="Réservez votre séjour" desc="Remplissez le formulaire — nous vous répondons sur WhatsApp en quelques minutes." light />

        <motion.form
          initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          onSubmit={submit}
          className="mt-12 max-w-3xl mx-auto glass rounded-3xl p-8 md:p-10 grid md:grid-cols-2 gap-5 text-ivory"
        >
          <Input label="Nom complet" value={f.name} onChange={(v) => set("name", v)} required />
          <Input label="Téléphone" value={f.phone} onChange={(v) => set("phone", v)} required />
          <SelectF label="Type de chambre" value={f.type} onChange={(v) => set("type", v)}
            options={["Chambre Double Standard", "Chambre Double Vue Mer", "Suite avec Kitchenette"]} />
          <Input label="Personnes" type="number" value={f.people} onChange={(v) => set("people", v)} />
          <Input label="Date d'arrivée" type="date" value={f.arrival} onChange={(v) => set("arrival", v)} required />
          <Input label="Date de départ" type="date" value={f.departure} onChange={(v) => set("departure", v)} required />
          <Input label="Heure d'arrivée prévue" type="time" value={f.arrivalTime} onChange={(v) => set("arrivalTime", v)} />
          <Input label="Demandes spéciales" value={f.notes} onChange={(v) => set("notes", v)} placeholder="Lit d'appoint, vue, etc." />
          <button type="submit" className="md:col-span-2 mt-2 px-6 py-4 rounded-full bg-coral hover:scale-[1.02] transition-transform text-ivory font-medium">
            Envoyer ma demande via WhatsApp
          </button>
        </motion.form>
      </div>
    </section>
  );
}

function Input({ label, value, onChange, type = "text", required, placeholder }: { label: string; value: string; onChange: (v: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-ivory/70">{label}</span>
      <input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} placeholder={placeholder}
        className="bg-ivory/10 border border-ivory/20 rounded-xl px-4 py-3 text-ivory placeholder:text-ivory/40 outline-none focus:border-coral transition-colors" />
    </label>
  );
}
function SelectF({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wider text-ivory/70">{label}</span>
      <select value={value} onChange={(e) => onChange(e.target.value)}
        className="bg-ivory/10 border border-ivory/20 rounded-xl px-4 py-3 text-ivory outline-none focus:border-coral">
        {options.map((o: string) => <option key={o} className="text-navy">{o}</option>)}
      </select>
    </label>
  );
}
