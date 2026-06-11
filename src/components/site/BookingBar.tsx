import { useState } from "react";
import { Calendar, Users, BedDouble, Search } from "lucide-react";
import { waLink } from "@/lib/hotel";

export default function BookingBar() {
  const [checkin, setCheckin] = useState("");
  const [checkout, setCheckout] = useState("");
  const [guests, setGuests] = useState("2");
  const [type, setType] = useState("Chambre Double Vue Mer");

  const handle = () => {
    const msg = `🏨 *DEMANDE DE DISPONIBILITÉ*
*Hotel Riviera Ramatou Plage — Lomé*
─────────────────────
🛏️ Type : ${type}
📅 Arrivée : ${checkin || "à préciser"}
📅 Départ : ${checkout || "à préciser"}
👥 Personnes : ${guests}
─────────────────────
Bonjour, je souhaite vérifier la disponibilité.`;
    window.open(waLink(msg), "_blank");
  };

  return (
    <div id="booking-bar" className="container mx-auto px-6 -mt-16 relative z-30">
      <div className="bg-ivory shadow-elegant rounded-2xl p-4 md:p-6 grid md:grid-cols-5 gap-3 border border-border">
        <Field icon={<Calendar size={18} />} label="Arrivée">
          <input type="date" value={checkin} onChange={(e) => setCheckin(e.target.value)} className="w-full bg-transparent outline-none text-navy" />
        </Field>
        <Field icon={<Calendar size={18} />} label="Départ">
          <input type="date" value={checkout} onChange={(e) => setCheckout(e.target.value)} className="w-full bg-transparent outline-none text-navy" />
        </Field>
        <Field icon={<Users size={18} />} label="Personnes">
          <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full bg-transparent outline-none text-navy">
            {[1,2,3,4,5,6].map(n=> <option key={n}>{n}</option>)}
          </select>
        </Field>
        <Field icon={<BedDouble size={18} />} label="Type">
          <select value={type} onChange={(e) => setType(e.target.value)} className="w-full bg-transparent outline-none text-navy">
            <option>Chambre Double Standard</option>
            <option>Chambre Double Vue Mer</option>
            <option>Suite avec Kitchenette</option>
          </select>
        </Field>
        <button onClick={handle} className="bg-ocean hover:bg-ocean-deep text-ivory rounded-xl flex items-center justify-center gap-2 font-medium py-3 transition-colors">
          <Search size={18} /> Vérifier
        </button>
      </div>
    </div>
  );
}

function Field({ icon, label, children }: { icon: React.ReactNode; label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1 px-3 py-2 rounded-xl border border-border hover:border-ocean transition-colors">
      <span className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
        <span className="text-ocean">{icon}</span> {label}
      </span>
      {children}
    </label>
  );
}
