import { Instagram, Mail, Phone, MapPin } from "lucide-react";
import { HOTEL } from "@/lib/hotel";

export default function Footer() {
  return (
    <footer className="bg-navy text-ivory pt-20 pb-10">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full gradient-sunset flex items-center justify-center font-display text-2xl text-ivory">R</div>
              <div>
                <div className="font-display text-2xl">{HOTEL.name}</div>
                <div className="text-xs tracking-[0.3em] uppercase text-ivory/60">{HOTEL.tagline}</div>
              </div>
            </div>
            <p className="text-ivory/70 text-sm max-w-md leading-relaxed">
              Une parenthèse tropicale au bord de l'Atlantique, à Lomé. Plage privée, piscine, restaurants et service attentionné — pour des séjours d'affaires comme de loisir.
            </p>
            <a href={`https://instagram.com/${HOTEL.instagram}`} target="_blank" rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-dark hover:bg-coral transition-colors">
              <Instagram size={16} /> @{HOTEL.instagram}
            </a>
          </div>
          <div>
            <div className="font-display text-lg mb-4">Liens</div>
            <ul className="space-y-2 text-sm text-ivory/70">
              <li><a href="#chambres" className="hover:text-coral">Chambres</a></li>
              <li><a href="#restaurants" className="hover:text-coral">Restaurants</a></li>
              <li><a href="#evenements" className="hover:text-coral">Événements</a></li>
              <li><a href="#galerie" className="hover:text-coral">Galerie</a></li>
              <li><a href="/admin" className="hover:text-coral">Admin</a></li>
            </ul>
          </div>
          <div>
            <div className="font-display text-lg mb-4">Contact</div>
            <ul className="space-y-3 text-sm text-ivory/70">
              <li className="flex gap-2"><MapPin size={16} className="text-sand shrink-0 mt-0.5" /> {HOTEL.address}</li>
              <li className="flex gap-2"><Phone size={16} className="text-sand shrink-0 mt-0.5" /> +{HOTEL.whatsapp}</li>
              <li className="flex gap-2"><Mail size={16} className="text-sand shrink-0 mt-0.5" /> {HOTEL.email}</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-6 border-t border-ivory/10 flex flex-col md:flex-row justify-between gap-4 text-xs text-ivory/50">
          <div>© {new Date().getFullYear()} {HOTEL.name}. Tous droits réservés.</div>
          <div>Lomé · Togo · Atlantique</div>
        </div>
      </div>
    </footer>
  );
}
